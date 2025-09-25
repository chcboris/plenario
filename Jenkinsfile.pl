pipeline {
  agent any

  environment {
    	branch_atual = "${env.GIT_BRANCH}"
  }

  tools {
      nodejs 'node-20'
  }

  options {
        buildDiscarder(logRotator(numToKeepStr: '3'))
  }

  stages {
      stage('Obter do GIT') {
                steps {
                    git branch: branch_atual,
                    credentialsId: 'giteaprod',
                    url: 'ssh://git@toolbox.tre-rj.jus.br:3022/sedsis/plenario-virtual.git'
                }
      }

      stage('Compilar e gerar versao') {
        when {
          expression { branch_atual == 'develop' }
        }
        steps {
          script{
            construirDesenv()
            construirHmol()
          }
        }
      }

      stage('Compilar e gerar versao producao') {
        when {
          expression { branch_atual == 'master' }
        }
        steps {
          script{
            construirProd()
            construirInternet()
          }
        }
      }
  }

   post {
      always {
          archiveArtifacts artifacts: 'plenario-virtual-build/*.war', onlyIfSuccessful: true
      }
  }

}

def construirDesenv() {

    docker.image('node:lts').inside {
      echo 'Construindo aplicacao em Desenv...'

      echo 'Preparar Diretorios'
      sh  '''
          mkdir -p plenario-virtual-build
          mkdir -p plenario-virtual-desenv
          rm -rf plenario-virtual-build/**
          rm -rf plenario-virtual-desenv/**
          '''
      echo 'Compilar e gerar versao desenv'
      sh  '''
          npm install
          npm run build
          '''

      echo 'Limpar e mover para diretorio desenv'
      sh  '''
          mv dist/plenario-virtual/browser/* plenario-virtual-desenv/
          rm -rf node_modules
          '''
    }

    echo 'Compactar arquivos gerados em war - desenv'
    sh  '''
        version=`cat src/app/shared/util/constantes.ts|grep "versaoAtual"| cut -d "'" -f 2`
        cd plenario-virtual-desenv
        jar cf plenario-virtual##desenv_${version}.${BUILD_NUMBER}.war *
        mv *.war ../plenario-virtual-build
        '''
}

def construirHmol() {
    docker.image('node:lts').inside {
      echo 'Construindo aplicacao em Hmol...'

      echo 'Preparar Diretorios'
      sh  '''
          mkdir -p plenario-virtual-build
          mkdir -p plenario-virtual-stage
          rm -rf plenario-virtual-stage/**
          '''
      echo 'Compilar e gerar versao Hmol'
      sh  "sed -i 's/desconhecido/${env.BUILD_NUMBER}/g' src/environments/environment.stage.ts"
      sh  '''
          npm install
          npm run build-stage
          '''

      echo 'Limpar e mover para diretorio Hmol'
      sh  '''
          mv dist/plenario-virtual/browser/* plenario-virtual-stage/
          rm -rf node_modules
          '''
    }
    echo 'Compactar arquivos gerados em war - Hmol'
    sh  '''
        version=`cat src/app/shared/util/constantes.ts|grep "versaoAtual"| cut -d "'" -f 2`
        cd plenario-virtual-stage
        jar cf plenario-virtual##hmol_${version}.${BUILD_NUMBER}.war *
        mv *.war ../plenario-virtual-build
        '''
}

def construirProd() {
  docker.image('node:lts').inside {
    echo 'Construindo aplicacao em Prod...'

    echo 'Preparar Diretorios'
    sh  '''
        mkdir -p plenario-virtual-build
        mkdir -p plenario-virtual-prod
        rm -rf plenario-virtual-build/**
        rm -rf plenario-virtual-prod/**
        '''
    echo 'Compilar e gerar versao Prod'
    sh  "sed -i 's/desconhecido/${env.BUILD_NUMBER}/g' src/environments/environment.prod.ts"
    sh  '''
        npm install
        npm run build-prod
        '''

    echo 'Limpar e mover para diretorio Prod'
    sh  '''
        mv dist/plenario-virtual/browser/* plenario-virtual-prod/
        rm -rf node_modules
        '''
  }
  echo 'Compactar arquivos gerados em war - Prod'
  sh  '''
      version=`cat src/app/shared/util/constantes.ts|grep "versaoAtual"| cut -d "'" -f 2`
      cd plenario-virtual-prod
      jar cf plenario-virtual##prod_${version}.${BUILD_NUMBER}.war *
      mv *.war ../plenario-virtual-build
      '''
}

def construirInternet() {
    docker.image('node:lts').inside {
      echo 'Construindo aplicacao na Internet...'

      echo 'Preparar Diretorios'
      sh  '''
          mkdir -p plenario-virtual-build
          mkdir -p plenario-virtual-internet
          rm -rf plenario-virtual-build/**
          rm -rf plenario-virtual-internet/**
          '''
      echo 'Compilar e gerar versao Internet'
      sh  "sed -i 's/desconhecido/${env.BUILD_NUMBER}/g' src/environments/environment.internet.ts"
      sh  '''
          npm install
          npm run build-internet
          '''

      echo 'Limpar e mover para diretorio Internet'
      sh  '''
          mv dist/plenario-virtual/browser/* plenario-virtual-internet/
          rm -rf node_modules
          '''
    }
    echo 'Compactar arquivos gerados em war - Internet'
    sh  '''
        version=`cat src/app/shared/util/constantes.ts|grep "versaoAtual"| cut -d "'" -f 2`
        cd plenario-virtual-internet
        jar cf plenario-virtual##internet_${version}.${BUILD_NUMBER}.war *
        mv *.war ../plenario-virtual-build
        '''
}
