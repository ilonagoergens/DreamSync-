# AWS Provider
provider "aws" {
  region = var.aws_region
}

# Erstellt einen S3-Bucket für die Website
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name

  tags = {
    Name = "Website Bucket"
  }
}
# Erstellt einen weiteren S3-Bucket für CloudFront Logs
resource "aws_s3_bucket" "log_bucket" {
  bucket = var.log_bucket_name

  tags = {
    Name = "My CloudFront Logs Bucket"
  }
}

# S3-Bucket-Ownership Controls für den Log-Bucket, damit der Bucket-Besitzer die Kontrolle hat
resource "aws_s3_bucket_ownership_controls" "log_bucket_ownership" {
  bucket = aws_s3_bucket.log_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Konfiguriert das S3-Bucket als statische Website, mit "index.html" als Startseite
resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html" # Die Datei, die beim Aufrufen der Website geladen wird
  }

}

# Setzt eine S3-Bucket-Policy, um den Zugriff auf die Website-Dateien (index.html) zu erlauben
resource "aws_s3_bucket_policy" "bucket_policy" {
  # Der Zugriff wird auf den CloudFront Origin Access Identity (OAI) beschränkt
  bucket = aws_s3_bucket.website_bucket.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow", # Erlaubt den Zugriff
        Principal = {
          # CloudFront Origin Access Identity (OAI) wird für den Zugriff verwendet
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.oai.id}"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# Gibt die URL der gehosteten S3-Website aus
output "s3_website_url" {
  value = "http://${aws_s3_bucket.website_bucket.website_endpoint}"
}
