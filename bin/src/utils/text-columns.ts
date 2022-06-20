interface Column {
  key: string;
  minWidth?: number;
}

export default (dataSource: any[], columns: Column[]) => {
  const rows: string[] = [];

  dataSource.forEach(item => {
    let row = '\u0020\u0020';

    row += columns.map(colum => (
      colum.minWidth
        ? item[colum.key].padEnd(colum.minWidth, '\u0020')
        : item[colum.key]
    )).join('');

    rows.push(row);
  });

  return rows.join('\r\n');
}
