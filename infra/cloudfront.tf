# Lokale Variable für Origin ID
locals {
  s3_origin_id = "s3-origin-id"  # Hier kannst du einen beliebigen Namen verwenden
}

# CloudFront Origin Access Identity (OAI) erstellen
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "CloudFront OAI for S3 Bucket"
}

# CloudFront Distribution für die S3-Website
resource "aws_cloudfront_distribution" "website_distribution" {
  # Hier greift Cloufront auf die daten zu
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
  # Hier wird die OAI für den Zugriff auf die S3-Bucket-Dateien verwendet
    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.oai.id}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "S3-backed CloudFront Distribution"
  default_root_object = "index.html"

  # Logging Konfiguration für CloudFront
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.log_bucket.bucket_regional_domain_name
    prefix          = "myprefix"
  }

  # Entferne diese Zeile, da du noch keine Domain hast
  # aliases = ["example.com"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["DE"]  # Hier kannst du weitere Länder hinzufügen, wenn nötig
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
