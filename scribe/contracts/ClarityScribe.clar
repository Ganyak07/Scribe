
;; title: ClarityScribe
;; version: 1.0
;; summary:Academic Credential Verification System
;; description:A system where institutions stake their reputation to verify credentials


;; Constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-REGISTERED (err u101))
(define-constant ERR-INSUFFICIENT-STAKE (err u102))
(define-constant ERR-CREDENTIAL-NOT-FOUND (err u103))
(define-constant ERR-ALREADY-VERIFIED (err u104))
(define-constant MINIMUM-STAKE u1000000) ;; in microSTX

;; Data structures
(define-map institutions 
    principal 
    {
        name: (string-ascii 64),
        stake-amount: uint,
        credentials-issued: uint,
        reputation-score: uint,
        active: bool
    }
)

(define-map credentials
    {id: (string-ascii 64), student: principal}
    {
        institution: principal,
        degree: (string-ascii 64),
        year: uint,
        verified: bool,
        endorsements: uint,
        metadata-url: (string-ascii 256)
    }
)

(define-map endorsements
    {credential-id: (string-ascii 64), endorser: principal}
    bool
)

;; Register as an educational institution
(define-public (register-institution (name (string-ascii 64)))
    (let ((caller tx-sender))
        (asserts! (not (default-to false (get active (map-get? institutions caller)))) ERR-ALREADY-REGISTERED)
        (try! (stx-transfer? MINIMUM-STAKE caller (as-contract tx-sender)))
        
        (map-set institutions caller {
            name: name,
            stake-amount: MINIMUM-STAKE,
            credentials-issued: u0,
            reputation-score: u100,
            active: true
        })
        (ok true)
    )
)

;; Issue a new academic credential
(define-public (issue-credential 
    (credential-id (string-ascii 64))
    (student principal)
    (degree (string-ascii 64))
    (year uint)
    (metadata-url (string-ascii 256)))
    
    (let (
        (institution tx-sender)
        (inst-data (unwrap! (map-get? institutions institution) ERR-NOT-AUTHORIZED))
    )
        (asserts! (get active inst-data) ERR-NOT-AUTHORIZED)
        (map-set credentials 
            {id: credential-id, student: student}
            {
                institution: institution,
                degree: degree,
                year: year,
                verified: true,
                endorsements: u0,
                metadata-url: metadata-url
            }
        )
        
        (map-set institutions institution
            (merge inst-data 
                {credentials-issued: (+ (get credentials-issued inst-data) u1)}
            )
        )
        (ok true)
    )
)

;; Endorse a credential (by other institutions)
(define-public (endorse-credential (credential-id (string-ascii 64)) (student principal))
    (let (
        (endorser tx-sender)
        (credential (unwrap! (map-get? credentials {id: credential-id, student: student}) ERR-CREDENTIAL-NOT-FOUND))
        (endorser-data (unwrap! (map-get? institutions endorser) ERR-NOT-AUTHORIZED))
    )
        (asserts! (get active endorser-data) ERR-NOT-AUTHORIZED)
        (asserts! (not (default-to false (map-get? endorsements {credential-id: credential-id, endorser: endorser}))) ERR-ALREADY-VERIFIED)
        
        ;; Record endorsement
        (map-set endorsements {credential-id: credential-id, endorser: endorser} true)
        
        ;; Update credential endorsement count
        (map-set credentials 
            {id: credential-id, student: student}
            (merge credential {endorsements: (+ (get endorsements credential) u1)})
        )
        
        ;; Increase institution's reputation
        (map-set institutions (get institution credential)
            (merge 
                (unwrap! (map-get? institutions (get institution credential)) ERR-NOT-AUTHORIZED)
                {reputation-score: (+ (get reputation-score endorser-data) u1)}
            )
        )
        (ok true)
    )
)

;; View functions
(define-read-only (get-credential (credential-id (string-ascii 64)) (student principal))
    (map-get? credentials {id: credential-id, student: student})
)

(define-read-only (get-institution-info (institution principal))
    (map-get? institutions institution)
)

(define-read-only (verify-endorsement (credential-id (string-ascii 64)) (endorser principal))
    (default-to false (map-get? endorsements {credential-id: credential-id, endorser: endorser}))
)