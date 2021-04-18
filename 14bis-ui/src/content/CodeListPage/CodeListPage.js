import { Button, Tabs, Tab } from 'carbon-components-react';
import React from 'react';
import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent
  } from 'carbon-components-react';
import { TableSplit24 } from '@carbon/icons-react';

const rows = [
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'Letter',
      code: '50',
      remarks: '-50',
    },
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'Letter',
      code: '50',
      remarks: '-55, -60',
    },
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'Cover',
      code: '50',
      remarks: '-60',
    },
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'Cover',
      code: '50',
      remarks: '-50',
    },
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'LEP',
      code: '50',
      remarks: '-50',
    },
    {
      id: 'a',
      secao: '00',
      subsecao: '-',
      blocknumber: '00',
      blockname: 'LEP',
      code: '50',
      remarks: '-50',
    },
  ];
  
  const headers = [
    {
      key: 'secao',
      header: 'Nº Seção',
    },
    {
      key: 'subsecao',
      header: 'Nº Subseção',
    },
    {
      key: 'blocknumber',
      header: 'Nº Block',
    },
    {
      key: 'blockname',
      header: 'Block Name',
    },
    {
      key: 'code',
      header: 'Code',
    },
    {
      key: 'remarks',
      header: 'Remarks',
    },
  ];

const CodeListPage = () => {
  return (
    
    <TableContainer title="Nome do manual" description="Tabela do Codelist">
    <Tabs type="container">
      <Tab id="Tab1" label="Codelist"> 
          <DataTable rows={rows} headers={headers}>
            {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getTableProps,
            }) => (
            
            <Table>
            <TableToolbar>
              <TableToolbarContent>              
                <Button onClick={() => {}} renderIcon={TableSplit24}>Codelist </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Table>
        )}
      </DataTable>

      </Tab>
      <Tab id="Tab2" label="LEP">

      </Tab>
    </Tabs>
    </TableContainer>
  );
};

export default CodeListPage;
