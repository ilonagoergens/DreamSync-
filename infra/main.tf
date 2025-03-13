# AWS Provider
provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

}

# Blockieren des öffentlichen Zugriffs auf den S3-Bucket
resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy, um den Zugriff auf die index.html-Datei zu ermöglichen
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket     = aws_s3_bucket.website_bucket.id
  depends_on = [aws_s3_bucket_public_access_block.public_access]
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# Hochladen der index.html-Datei
resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.website_bucket.bucket
  key          = "index.html"
  source       = "../app/index.html"
  content_type = "text/html"
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.example.website_endpoint
}