# AWS Provider
provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name

  tags = {
    Name = "Website Bucket"
  }
}

resource "aws_s3_bucket" "log_bucket" {
  bucket = var.log_bucket_name # Verwende den Log-Bucket-Namen aus der Variablen

  tags = {
    Name = "My CloudFront Logs Bucket"
  }
}

# S3 Bucket Ownership Controls
resource "aws_s3_bucket_ownership_controls" "log_bucket_ownership" {
  bucket = aws_s3_bucket.log_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}


resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

}

# S3 Bucket Policy, um den Zugriff auf die index.html-Datei zu ermöglichen
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.oai.id}"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# Ausgabe der S3-Website-URL
output "s3_website_url" {
  value = "http://${aws_s3_bucket.website_bucket.website_endpoint}"
}
