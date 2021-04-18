import { Button, Tabs, Tab } from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
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
  
const headers = [
  {
    key: 'secao',
    header: 'Nº Seção',
  },
  {
    key: 'subSecao',
    header: 'Nº Subseção',
  },
  {
    key: 'bloco',
    header: 'Nº Block',
  },
  {
    key: 'nomeBloco',
    header: 'Block Name',
  },
  {
    key: 'codigo',
    header: 'Code',
  },
  {
    key: 'aplicabilidade',
    header: 'Remarks',
  },
  {
    key: 'tag',
    header: 'Tag',
  },
];

const CodeListPage = () => {
  var [rows, setRows] = useState([]);
  var [isLoaded, setLoaded] = useState(false);
  
  useEffect(async () => {
    if (!isLoaded) {
      setRows(await fetch("http://localhost:8585/api/codelist").then(response => response.json()))
      setLoaded(true);
    }
  })

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
