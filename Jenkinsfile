pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh 'aws s3 cp external_points.js s3://skidataloyalty-cdn/externalpoints/stage/external_points.js'
                sh 'aws s3 cp external_points.js s3://skidataloyalty-cdn/externalpoints/live/external_points.js'
                sh 'aws cloudfront create-invalidation --distribution-id E3INAVDJQDP9UV --paths /external_points.js'
                sh 'aws cloudfront create-invalidation --distribution-id E39IX0I4FIDNZ2 --paths /external_points.js'
            }
        }
    }
}
