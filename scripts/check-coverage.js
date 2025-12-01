const fs = require('fs');
const path = require('path');

/**
 * Script para verificar thresholds de cobertura de código
 *
 * Lee el reporte de cobertura generado por Karma/Istanbul
 * y verifica que se cumplan los thresholds mínimos.
 *
 * Exit codes:
 * 0: Éxito - Todos los thresholds cumplidos
 * 1: Error - Thresholds no cumplidos
 */

const COVERAGE_DIR = path.join(__dirname, '../coverage');
const SUMMARY_FILE = path.join(COVERAGE_DIR, 'coverage-summary.json');

// Thresholds mínimos requeridos
const THRESHOLDS = {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80
};

function main() {
  console.log('🔍 Verificando cobertura de código...\n');

  // Verificar que existe el archivo de cobertura
  if (!fs.existsSync(SUMMARY_FILE)) {
    console.error('❌ Archivo de cobertura no encontrado. Ejecuta "npm run test:coverage" primero.');
    process.exit(1);
  }

  // Leer el archivo de cobertura
  let coverageData;
  try {
    const rawData = fs.readFileSync(SUMMARY_FILE, 'utf8');
    coverageData = JSON.parse(rawData);
  } catch (error) {
    console.error('❌ Error leyendo archivo de cobertura:', error.message);
    process.exit(1);
  }

  // Obtener métricas totales
  const total = coverageData.total;
  if (!total) {
    console.error('❌ No se encontraron métricas de cobertura totales');
    process.exit(1);
  }

  console.log('📊 COBERTURA DE CÓDIGO\n');
  console.log('═'.repeat(50));

  // Verificar cada métrica
  const metrics = ['statements', 'branches', 'functions', 'lines'];
  let allPassed = true;

  metrics.forEach(metric => {
    const value = total[metric].pct;
    const threshold = THRESHOLDS[metric];
    const passed = value >= threshold;

    if (!passed) {
      allPassed = false;
    }

    const status = passed ? '✅' : '❌';
    const color = passed ? '\x1b[32m' : '\x1b[31m'; // Verde o rojo
    const reset = '\x1b[0m';

    console.log(
      `${status} ${metric.padEnd(12)} ${color}${value.toFixed(2)}%${reset} ` +
      `(mínimo: ${threshold}%)`
    );
  });

  console.log('═'.repeat(50));

  // Mostrar archivos con baja cobertura
  console.log('\n📉 ARCHIVOS CON BAJA COBERTURA (< 80%):\n');

  const files = Object.keys(coverageData).filter(key => key !== 'total');
  const lowCoverageFiles = [];

  files.forEach(file => {
    const fileCoverage = coverageData[file];
    const avgCoverage = (
      fileCoverage.statements.pct +
      fileCoverage.branches.pct +
      fileCoverage.functions.pct +
      fileCoverage.lines.pct
    ) / 4;

    if (avgCoverage < 80) {
      lowCoverageFiles.push({
        file,
        coverage: avgCoverage
      });
    }
  });

  if (lowCoverageFiles.length === 0) {
    console.log('✅ Todos los archivos cumplen con el threshold mínimo\n');
  } else {
    lowCoverageFiles
      .sort((a, b) => a.coverage - b.coverage)
      .slice(0, 10) // Top 10
      .forEach(({ file, coverage }) => {
        console.log(`  ${coverage.toFixed(2)}% - ${file}`);
      });

    if (lowCoverageFiles.length > 10) {
      console.log(`  ... y ${lowCoverageFiles.length - 10} archivos más\n`);
    }
  }

  console.log('═'.repeat(50));

  // Resultado final
  if (allPassed) {
    console.log('✅ TODOS LOS THRESHOLDS DE COBERTURA CUMPLIDOS\n');
    console.log('📊 Reporte completo disponible en: coverage/index.html\n');
    process.exit(0);
  } else {
    console.error('❌ THRESHOLDS DE COBERTURA NO CUMPLIDOS\n');
    console.error('💡 Ejecuta "npm run coverage:open" para ver el reporte detallado\n');
    console.error('💡 Mejora la cobertura agregando más tests unitarios\n');
    process.exit(1);
  }
}

// Ejecutar el script
main();