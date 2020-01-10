
import React, {useEffect } from 'react';
import { HotTable } from '@handsontable/react';

const licenseKey = 'non-commercial-and-evaluation';


export default function SolrGrid(props) {
  let hotTableRef;
  let rowSelection = {};

  const { data, columns, hidden, colHeaders } = props;

  let afterSelection = (row, col, row2, col2) => {

    // always clear selection on click
    let allCBs = document.querySelectorAll(`.rowHeader [type="checkbox"]`);
    allCBs.forEach(cb => cb.checked = false);
    rowSelection = {};

    // ensure this is a row selection
    if (col !== 0 || col2 !== columns.length - hidden.length - 1) return;

    // mark new selection
    let start = row < row2 ? row : row2,
        end = row2 > row ? row2 : row;
    for (let i = start; i <= end; i++) {
      let cb = document.querySelector(`[data-row="${i}"]`);
      let checked = rowSelection[i];
      cb.checked = !checked;
      rowSelection[i] = !checked;
    }

    hotTableRef.hotInstance.render()
    setTimeout(() => {
      props.onRowSelect();
    })

  }

  let rowHeaders = i => {
    if (rowSelection[i])
      return `<input type="checkbox" data-row=${i} checked />`;
    return `<input type="checkbox" data-row=${i} />`;
  }

  useEffect(() => {

  }, [data, columns, colHeaders, hidden])

  return (
    <div>
      <HotTable settings={{
        data,
        columns,
        colHeaders,
        rowHeaders,
        width: '100%',
        height: '70%',
        wordWrap: false,
        multiColumnSorting: true,
        manualColumnResize: true,
        manualColumnMove: true,
        manualRowResize: false,
        filters: true,
        dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
        readOnly: true,
        afterSelection,
        licenseKey
        // autoColumnSize: true,
        // stretchH: 'all',
        //renderAllRows: true, // has performance issues
        //renderAllColumns: true,
        }}

        ref={ht => hotTableRef = ht}

        hiddenColumns={{
          columns: hidden
        }}
        />
    </div>
  )
}