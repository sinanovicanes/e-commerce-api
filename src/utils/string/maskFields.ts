export function maskField(field: string): string {
  return `${field.charAt(0).toUpperCase()}**`;
}

// OUTPUT: maskFields('name', 'lastname') => 'N** L**'
export function maskFields(...args: string[]): string {
  return args.map(maskField).join(' ');
}
