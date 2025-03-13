variable "aws_region" {
  description = "Aws region"
  type        = string
  default     = "eu-central-1" # gebe deine Region an
}

variable "bucket_name" {
  description = "Name of the bucket"
  type        = string
  default     = "dreamsync-app-ilona123" # vergebe einen eindeutigen Namen
}