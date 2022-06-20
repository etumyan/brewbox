import fs from 'fs';

export default (filePath: string, modificator: (data: any) => any) => {
  if (typeof modificator !== 'function') return;

  const rawData = fs.readFileSync(filePath);
  const modifiedData = modificator(JSON.parse(rawData as any));

  fs.writeFileSync(filePath, JSON.stringify(modifiedData));
};
