import { spawn } from 'child_process';

const action = process.argv[2] || 'dev';
const rawArgs = process.argv.slice(3);
const filteredArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      i++;
    }
    continue;
  }
  if (arg.startsWith('--host=')) {
    continue;
  }
  filteredArgs.push(arg);
}

// Default options if not provided
if (!filteredArgs.includes('--port') && !filteredArgs.includes('-p')) {
  filteredArgs.push('--port', '3000');
}
if (!filteredArgs.includes('--hostname') && !filteredArgs.includes('-H')) {
  filteredArgs.push('--hostname', '0.0.0.0');
}

console.log(`Starting Next.js ${action} with args:`, filteredArgs);

const child = spawn('next', [action, ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  process.exit(code || 0);
});
