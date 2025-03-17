# Lokale Variable für Origin ID
locals {
  s3_origin_id = "s3-origin-id"  # Hier kannst du einen beliebigen Namen verwenden
}

# CloudFront Origin Access Identity (OAI) erstellen
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "CloudFront OAI for S3 Bucket"
}

# CloudFront Distribution für die S3-Website erstellen
resource "aws_cloudfront_distribution" "website_distribution" {
  # Definiert, von welchem S3-Bucket CloudFront die Daten holen soll
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id # Verwendet die oben definierte Origin ID

  # Konfiguration für den S3-Zugang über CloudFront
    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
    }
  }

  enabled             = true # Aktiviert die CloudFront-Distribution
  is_ipv6_enabled     = true # Aktiviert IPv6-Unterstützung
  comment             = "S3-backed CloudFront Distribution" # Beschreibung der Distribution
  default_root_object = "index.html" # Die Standard-Startseite für die CloudFront-Distribution

  # Logging Konfiguration für CloudFront
  logging_config {
    include_cookies = false # Keine Cookies in den Logs einbeziehen
    bucket          = aws_s3_bucket.log_bucket.bucket_regional_domain_name # Der S3-Bucket für Logs
    prefix          = "myprefix" # Ein Präfix für die Log-Dateien
  }

 # Hier kannst du eine Domain hinzufügen, wenn du eine benutzerdefinierte Domain hast
# aliases = ["example.com"]   # Wird entfernt, wenn keine benutzerdefinierte Domain vorhanden ist

  # Konfiguration für das Cache-Verhalten von CloudFront
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"] # Erlaubte HTTP-Methoden
    cached_methods   = ["GET", "HEAD"] # Methoden, die zwischengespeichert werden
    target_origin_id = local.s3_origin_id # Referenziert die Origin ID für den S3-Bucket

 # Weiterleitungswerte (keine Query-Strings und keine Cookies)
    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
 # Leitet Benutzer zu HTTPS um, wenn sie über HTTP auf die Seite zugreifen
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Preisoption für CloudFront (wählt die günstigste Preisstufe)
  price_class = "PriceClass_100"

  # Geo-Restriktionen: Nur Benutzer aus Deutschland (DE) dürfen auf die Website zugreifen

  restrictions {
    geo_restriction {
      restriction_type = "whitelist" # Erlaubt nur bestimmte Länder
      locations        = ["DE"]  # Nur Deutschland wird zugelassen
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true  # Standard-CloudFront-Zertifikat verwenden
  }
}

# Ausgabe der CloudFront-URL
output "cloudfront_url" {
  value = aws_cloudfront_distribution.website_distribution.domain_name
}
