terraform {
  backend "s3" {
    # Speichert den Terraform-Status in einem S3-Bucket.
    # Der Status hilft Terraform, den aktuellen Stand der Infrastruktur zu verfolgen.
    bucket         = "techstarter-ilona-terraform-state"  # Der Name des S3-Buckets.
    key            = "terraform/state.tfstate"           # Der Name der Datei, in der der Status gespeichert wird.
    region         = "eu-central-1"                      # Region (Europa Frankfurt)
    encrypt        = true                                 # Verschlüsselung aktivieren
    dynamodb_table = "terraform-state-lock"              # DynamoDB-Tabelle für Locking
  }
}