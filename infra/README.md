# DreamSync Infra Setup

Dieses Projekt stellt eine Infrastruktur für eine einfache Website bereit, die auf Amazon Web Services (AWS) gehostet wird. Es nutzt Terraform, um Ressourcen wie S3-Buckets, CloudFront-Distributionen und DynamoDB für das Locking von Terraform-States zu erstellen.

## Voraussetzungen

- **Terraform** (mindestens Version 1.0)
- **AWS CLI** und ein AWS-Konto
- **AWS IAM-Berechtigungen** für das Erstellen von S3-Buckets, CloudFront-Distributionen und DynamoDB-Tabellen

## Projektstruktur

- `main.tf`: Die Hauptkonfiguration für die Infrastruktur, einschließlich der S3-Buckets und CloudFront-Distribution.
- `cloudfront.tf`: Die Konfiguration für die CloudFront-Distribution, die die S3-Website bereitstellt.
- `variables.tf`: Hier werden Variablen wie `aws_region`, `bucket_name` und `log_bucket_name` definiert.
- `backend.tf`: Konfiguration des Terraform Backends, das den Remote-Backend für Terraform-States über S3 und DynamoDB verwendet.
- `README.md`: Diese Datei.

## Setup-Anleitung

### 1. AWS-Region und Variablen anpassen

Öffne die Datei `variables.tf` und passe die folgenden Variablen an:

```hcl
variable "aws_region" {
  description = "Aws region"
  type        = string
  default     = "eu-central-1" # Ändere dies auf deine Region
}

variable "bucket_name" {
  description = "Name of the bucket"
  type        = string
  default     = "dreamsync-app-ilona123" # Wähle einen einzigartigen Namen für deinen S3-Bucket
}

variable "log_bucket_name" {
  description = "Name of the log bucket"
  type        = string
  default     = "mylogs-ilona-logs" # Wähle einen einzigartigen Namen für den Log-Bucket
}
```

### 2. DynamoDB-Tabelle für Terraform State Locking erstellen

Bevor du mit Terraform arbeitest, musst du die DynamoDB-Tabelle für das Locking des Terraform-States erstellen. Dies kannst du über die AWS Management Console tun.

- **Tabelle erstellen**:
  1. Gehe zu DynamoDB in der AWS Console.
  2. Erstelle eine neue Tabelle namens `terraform-state-lock`.
  3. Setze den **Partition Key** auf `LockID` (Typ: String).
  4. Aktiviere die **Provisioned Capacity** oder **On-Demand**-Option, je nachdem, was für dich am besten passt.

Nachdem du diese Tabelle erstellt hast, kannst du Terraform mit dem Remote-Backend für das Locking des Terraform-States nutzen.

### 3. Backend konfigurieren

In der Datei `backend.tf` wird das Backend für den Terraform-State konfiguriert, welches S3 und DynamoDB für das Locking nutzt. Stelle sicher, dass du den Namen des S3-Buckets (`techstarter-ilona-terraform-state`) und der DynamoDB-Tabelle (`terraform-state-lock`) anpasst:

```hcl
terraform {
  backend "s3" {
    bucket         = "techstarter-ilona-terraform-state"  # Dein S3-Bucket-Name
    key            = "terraform/state.tfstate"
    region         = "eu-central-1"                      # Region (Europa Frankfurt)
    encrypt        = true                                 # Verschlüsselung aktivieren
    dynamodb_table = "terraform-state-lock"              # DynamoDB-Tabelle für Locking
  }
}
```

### 4. Ressourcen erstellen

Um die Ressourcen in AWS zu erstellen, führe die folgenden Terraform-Befehle aus:

```bash
terraform init     # Initialisiert das Terraform-Projekt
terraform plan     # Zeigt die geplanten Änderungen an
terraform apply    # Wendet die Änderungen an und erstellt die Infrastruktur
```

### 5. CloudFront Distribution

Die CloudFront-Distribution wird mit einer OAI (Origin Access Identity) konfiguriert, um den Zugriff auf den S3-Bucket zu ermöglichen. Stelle sicher, dass CloudFront so konfiguriert ist, dass es die Dateien aus deinem S3-Bucket bereitstellt:

```hcl
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "CloudFront OAI for S3 Bucket"
}

resource "aws_cloudfront_distribution" "website_distribution" {
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.log_bucket.bucket_regional_domain_name
    prefix          = "myprefix"
  }
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    min_ttl          = 0
    default_ttl      = 3600
    max_ttl          = 86400
  }
  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["DE"]  # Hier kannst du weitere Länder hinzufügen
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true  # Standard-CloudFront-Zertifikat
  }
}
```

### 6. Zugriff auf die Website

Nach der erfolgreichen Anwendung von Terraform kannst du auf die bereitgestellte CloudFront-URL zugreifen. Diese URL wird in der Ausgabe angezeigt:

```hcl
output "cloudfront_url" {
  value = aws_cloudfront_distribution.website_distribution.domain_name
}
```

Die S3-Website-URL wird ebenfalls ausgegeben:

```hcl
output "s3_website_url" {
  value = "http://${aws_s3_bucket.website_bucket.website_endpoint}"
}
```

### 7. Logs

Logs für den CloudFront-Verkehr werden in einem separaten S3-Bucket gespeichert. Stelle sicher, dass dieser korrekt eingerichtet ist und dass die `logging_config` der CloudFront-Distribution auf diesen Log-Bucket verweist.

## Wichtige Hinweise

- **DynamoDB für Terraform-States**: Die DynamoDB-Tabelle für das Locking des Terraform-States muss über die AWS Management Console erstellt werden. Diese Tabelle verhindert parallele Terraform-Läufe und stellt sicher, dass nur eine Instanz von Terraform gleichzeitig den State bearbeiten kann.
  
- **AWS IAM-Berechtigungen**: Stelle sicher, dass du über die richtigen IAM-Rollen und -Berechtigungen verfügst, um diese Ressourcen zu erstellen, zu verwalten und darauf zuzugreifen.

