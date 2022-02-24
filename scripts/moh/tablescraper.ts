import cheerio from 'cheerio';

enum TableStructure {
  RowAndColumnHeaders,
  ColumnHeaders,
  RowHeaders,
}

const cleanValue = (str: string) => {
  let cleanedValue = str.replace(/[\*,]/g, '').trim();
  const maybeNumber = Number(cleanedValue);
  return Number.isNaN(maybeNumber) ? cleanedValue : maybeNumber;
};

const cleanHeading = (str: string) => {
  return str.replace(/\*/g, '').trim();
};

const getTableStructure = (tableHtml: string) => {
  const $ = cheerio.load(tableHtml);
  const table = $('table');

  const hasColumnHeaders = table.children('thead').length !== 0;
  const hasRowHeaders = table.find('tbody tr th:first-child').length !== 0;

  if (hasColumnHeaders && hasRowHeaders) {
    return TableStructure.RowAndColumnHeaders;
  } else if (hasColumnHeaders) {
    return TableStructure.ColumnHeaders;
  } else if (hasRowHeaders) {
    return TableStructure.RowHeaders;
  } else {
    return null;
  }
};

export const scrapeTable = (tableHtml: string) => {
  const tableStructure = getTableStructure(tableHtml);

  if (tableStructure === TableStructure.ColumnHeaders) {
    return scrapeTableWithColumnHeaders(tableHtml);
  } else if (tableStructure === TableStructure.RowHeaders) {
    return scrapeTableWithRowHeaders(tableHtml);
  } else if (tableStructure === TableStructure.RowAndColumnHeaders) {
    return scrapeTableWithColumnAndRowHeaders(tableHtml);
  } else {
    throw new Error('Unrecognised table structure');
  }
};

// A mess!
const scrapeTableWithRowHeaders = (tableHtml: string) => {
  const $ = cheerio.load(tableHtml);
  const table = $('table');

  let result = {};

  let spanRow = 0;
  let key = '';
  let key2: string | null = null;
  table.find('tbody tr').each((_, tr) => {
    $(tr)
      .children()
      .each((i, el) => {
        if (el.tagName === 'th') {
          if (spanRow > 0) {
            key2 = cleanHeading($(el).text());
          } else {
            key = cleanHeading($(el).text());
            if ($(el).attr('rowspan') != null) {
              spanRow = Number($(el).attr('rowspan'));
            }
          }
        } else if (el.tagName === 'td') {
          if (key2) {
            if (!result[key]) {
              result[key] = {};
            }

            result[key][key2] = cleanValue($(el).text());
          } else {
            result[key] = cleanValue($(el).text());
          }
        }
      });

    if (spanRow > 0) {
      spanRow--;
      if (spanRow === 0) {
        key2 = null;
      }
    }
  });

  return result;
};

// These processing functions need some work!
const scrapeTableWithColumnAndRowHeaders = (tableHtml: string) => {
  const $ = cheerio.load(tableHtml);
  const table = $('table');

  const colHeadings = table
    .find('thead tr th')
    .map((_, el) => $(el).text())
    .toArray();

  let result = {};

  table.find('tbody tr').each((_, tr) => {
    let key = '';

    $(tr)
      .children()
      .each((i, el) => {
        if (el.tagName === 'th') {
          key = cleanHeading($(el).text());
          result[key] = {};
        } else if (el.tagName === 'td') {
          result[key][cleanHeading(colHeadings[i])] = cleanValue($(el).text());
        }
      });
  });

  return result;
};

const scrapeTableWithColumnHeaders = (tableHtml: string) => {
  const $ = cheerio.load(tableHtml);
  const table = $('table');

  const colHeadings = table
    .find('thead tr th')
    .map((_, el) => $(el).text())
    .toArray();

  let rows = [];

  table.find('tbody tr').each((_, tr) => {
    const row = {};
    $(tr)
      .children()
      .each((i, el) => {
        row[cleanHeading(colHeadings[i])] = cleanValue($(el).text());
      });

    rows.push(row);
  });

  return rows;
};
