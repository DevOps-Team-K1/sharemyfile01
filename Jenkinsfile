pipeline {
  agent any

  tools {
    // must match the name you gave in Manage Jenkins → Global Tool Configuration
    nodejs 'Node20'
  }

  environment {
    // default AWS region
    AWS_DEFAULT_REGION = 'eu-west-1'
  }

  triggers {
    // Poll your Git repo every 5 minutes; swap to GitHub webhooks if you prefer
    pollSCM('H/5 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        // get your code
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        // on Windows, use 'bat' instead of 'sh'
        bat 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        bat 'npm run lint'
      }
    }

    // If/when you add tests:
    stage('Test') {
      when {
        expression { 
          // only run if there's a test script configured
          return fileExists('package.json') && readFile('package.json').contains('"test"') 
        }
      }
      steps {
        bat 'npm test -- --ci --reporter junit --outputFile=test-results/results.xml'
      }
      post {
        always {
          // publish JUnit XML results
          junit 'test-results/*.xml'
        }
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
      post {
        success {
          // archive build artifacts in Jenkins
          archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
      }
    }

    stage('Deploy to S3') {
      when {
        branch 'main'
      }
      steps {
        // withAWS comes from the Pipeline: AWS Steps plugin
        withAWS(credentials: 'AWS_Creds', region: "${env.AWS_DEFAULT_REGION}") {
          // sync the built files to your S3 bucket
          bat 'aws s3 sync dist\\ s3://your-bucket-name/ --delete'
        }
      }
    }
  }

  post {
    success {
      echo '✅ Build & deploy succeeded!'
      // you can add, e.g. slackSend or emailext here
    }
    failure {
      echo '❌ Build or deploy failed!'
    }
  }
}
