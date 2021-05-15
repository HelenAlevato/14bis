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
import { Book24, Document24, DocumentView24, TableSplit24 } from '@carbon/icons-react';

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

const headersTableLEP = [
  {
    key: 'full',
    header: 'Full',
  },
  {
    key: 'delta',
    header: 'Delta',
  },
  {
    key: 'lep',
    header: 'LEP',
  },
  {
    key: 'remarks',
    header: 'Remarks',
  },
  {
    key: 'name',
    header: 'Name',
  },
];

const doctTypes = ["Mars","Alpha Centauro","Saturno","Jupiter","Moon","Pluto"]

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
    <>
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
                      <Button onClick={() => { }} renderIcon={TableSplit24}>Codelist </Button>
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
            <DataTable rows={rows} headers={headersTableLEP}>
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
                      <Button onClick={() => { }} renderIcon={TableSplit24}>Codelist </Button>
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
                          <TableCell key={"full"}>
                            <Book24 />
                          </TableCell>
                          <TableCell key={"delta"}>
                            <Document24 />  
                          </TableCell>
                          <TableCell key={"lep"}>
                            <DocumentView24 />
                          </TableCell>
                          <TableCell key={"remarks"}>
                            {"-50"}
                          </TableCell>
                          <TableCell key={"name"}>
                            {doctTypes[Math.floor((Math.random() * 6))]}
                          </TableCell>
                          {/* {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value + " | segunda aba"}</TableCell>
                          ))} */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Table>
              )}
            </DataTable>
          </Tab>
        </Tabs>
      </TableContainer>
      
      <div>
        <Button>Fechar</Button>
      </div>
    </>
  );
};

export default CodeListPage;
