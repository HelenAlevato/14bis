import { Add16, ArrowLeft32, Book24, Document24, DocumentView24 } from '@carbon/icons-react';
import {
  Button, DataTable, Form, Modal, Tab, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent, Tabs, TextInput
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import reactDom from 'react-dom';
import { Link, useParams } from 'react-router-dom';

const headersCodelist = [
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

const CodeListPage = () => {
  let [codeList, setCodeList] = useState([]);
  let [lepList, setLepList] = useState([]);
  let [isLoaded, setLoaded] = useState(false);
  let [isOpen, setOpen] = useState(false);

  let nomeManual = useParams().nomeManual;

  useEffect(async () => {
    if (!isLoaded) {
      setCodeList(await fetch(`http://localhost:8585/api/codelist/manual/${nomeManual}`)
        .then(response => response.json()))

      // Preencher a lista de Lep
      lepList = []
      codeList.forEach(bloco => {
        if (bloco.aplicabilidade.includes(",")) {
          let remarks = bloco.aplicabilidade.split(",")
          let tags = bloco.tag.split(",")
          for (let i = 0; i < remarks.length; i++) {
            lepList.push({ aplicabilidade: remarks[i], tag: tags[i] })
          }
        } else {
          lepList.push({ aplicabilidade: bloco.aplicabilidade, tag: bloco.tag })
        }
      })
      lepList = lepList.map((row, index) => {
        return {
          id: index,
          ...row
        }
      })
      setLepList(lepList);
      setLoaded(true);
    }
  })

  const drawNewBlockModal = () => {
    return (
      reactDom.createPortal(
        <Modal
          open={isOpen}
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={() => { }}
          modalHeading="Adicionar novo Bloco ao Codelist"
          modalLabel=""
          primaryButtonText="Save"
          secondaryButtonText="Cancel">
          <Form>
            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Seção"
                placeholder="Placeholder text"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Sub Seção"
                placeholder="Placeholder text"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Nº Block"
                placeholder="Placeholder text"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Block Name"
                placeholder="Placeholder text"
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Code"
                placeholder="Placeholder text"
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Remarks"
                placeholder="Placeholder text"
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <TextInput
                id="test2"
                invalidText="Invalid error message."
                labelText="Tag"
                placeholder="Placeholder text"
              />
            </div>

          </Form>
        </Modal>,
        document.body
      ))
  }

  const handleOpenPDF = async () => {
    const arrayBuffer = await fetch(`http://localhost:8585/pdfpage/getpdf`).then(response => response.arrayBuffer())
    
    const file = new Blob([arrayBuffer], {
      type: 'application/pdf',
    });

    //Build a URL from the file
    console.log(file)
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  }

  return (
    <>
      {drawNewBlockModal()}

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">
          <ArrowLeft32 />
        </Link>
      </div>

      <div style={{ backgroundColor: "#f4f4f4" }}>
        <TableContainer title={nomeManual} description="Tabela do Codelist">
          <Tabs type="container" style={{ display: "flex", alignSelf: "center" }}>
            <Tab id="Tab1" label="Codelist">
              <DataTable rows={codeList} headers={headersCodelist} size="short" >
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
                        <div style={{ display: 'flex', backgroundColor: '#f1f1f1', padding: '10px 0' }}>
                          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: '0.75em', display: 'self', alignSelf: 'center', padding: '0 15px' }}>
                            Novo bloco
                          </span>
                          <Button hasIconOnly size="sm" renderIcon={Add16} iconDescription="Adicionar" tooltipPosition="right" onClick={() => setOpen(!isOpen)} />
                        </div>
                      </TableToolbarContent>
                      <TableToolbarContent>
                        <Link to={`/EditCodeList/${nomeManual}`}>
                          <Button>Editar Codelist</Button>
                        </Link>
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
              <DataTable rows={lepList} headers={headersTableLEP}>
                {({
                  rows,
                  headers,
                  getHeaderProps,
                  getRowProps,
                  getTableProps,
                }) => (

                  <Table>
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
                        {rows.map((row, index) => (
                          <TableRow {...getRowProps({ row })}>
                            <TableCell key={"full"}>
                              <Button 
                                hasIconOnly 
                                size="sm" 
                                kind="ghost" 
                                renderIcon={Book24} 
                                iconDescription="Abrir Documento" 
                                tooltipPosition="right" 
                                onClick={handleOpenPDF} />
                            </TableCell>
                            <TableCell key={"delta"}>
                              <Button 
                                hasIconOnly 
                                size="sm" 
                                kind="ghost" 
                                renderIcon={Document24} 
                                iconDescription="Abrir Documento" 
                                tooltipPosition="right" 
                                onClick={handleOpenPDF} />
                            </TableCell>
                            <TableCell key={"lep"}>
                              <Button 
                                hasIconOnly 
                                size="sm" 
                                kind="ghost" 
                                renderIcon={DocumentView24} 
                                iconDescription="Abrir Documento" 
                                tooltipPosition="right" 
                                onClick={handleOpenPDF} />
                            </TableCell>
                            <TableCell key={"remarks"}>
                              {lepList[index].aplicabilidade}
                            </TableCell>
                            <TableCell key={"name"}>
                              {lepList[index].tag}
                            </TableCell>
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
      </div>
    </>
  );
};

export default CodeListPage;
