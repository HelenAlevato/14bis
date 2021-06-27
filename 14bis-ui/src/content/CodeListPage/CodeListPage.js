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
    header: 'Section',
  },
  {
    key: 'subSecao',
    header: 'Subsection',
  },
  {
    key: 'bloco',
    header: 'Block Number',
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
    key: 'other',
    header: '',
    style: { width: '5%' }
  },
];

const CodeListPage = () => {
  let [codeList, setCodeList] = useState([]);
  let [lepList, setLepList] = useState([]);
  let [isLoaded, setLoaded] = useState(false);
  let [isOpen, setOpen] = useState(false);
  let [errorMessage, setErrorMessage] = useState({open: false, title: '', message: ''});

  let nomeManual = useParams().nomeManual;

  // função ativada quando a tela é redesenhada
  useEffect(async () => {
    // se não tiver carregado os dados, ele vai buscar na API 1 vez e definir que já foi carregado
    if (!isLoaded) {
      setCodeList(await fetch(`http://localhost:8585/api/codelist/manual/${nomeManual}`)
        .then(response => response.json()))

      // Preencher a variavel lista de Lep, 
      // filtrando e agrupando os codelists com base na aplicabilidade
      lepList = []
      codeList.forEach(bloco => {
        if (bloco.aplicabilidade.includes(",")) {
          let remarks = bloco.aplicabilidade.split(", ")
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

      let existingDocuments = []

      lepList = lepList.map(lepRow => {
        if (!existingDocuments.includes(lepRow.aplicabilidade)) {
          existingDocuments.push(lepRow.aplicabilidade)
          return lepRow;
        }
      }).filter(lepRow => lepRow !== undefined && lepRow.aplicabilidade !== "ALL")
      setLepList(lepList);
      setLoaded(true);
    }
  })

  // função que retorna o HTML para desenhar o modal "adicionar novo bloco"
  // OBS: só vai desenhar se a variável "isOpen" for "true"
  const drawNewBlockModal = () => {
    return (
      reactDom.createPortal(
        <Modal
          open={isOpen}
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={() => { }}
          modalHeading="Add new Block to Codelist"
          modalLabel=""
          primaryButtonText="Save"
          secondaryButtonText="Cancel">
          <Form>
            <div class="bx--grid">
              <div class="bx--row">
                <TextInput className="bx--col-sm-1"
                  invalidText="Invalid error message."
                  labelText="Seção"
                  maxlength="2"
                />
                <TextInput className="bx--col-sm-1"
                  invalidText="Invalid error message."
                  labelText="Sub Seção"
                  maxlength="2"
                />
                <TextInput className="bx--col-sm-1"
                  invalidText="Invalid error message."
                  labelText="Nº Block"
                  maxlength="2"
                />
                <TextInput style={{ marginBottom: '2rem' }}
                  invalidText="Invalid error message."
                  labelText="Block Name"
                  placeholder="Placeholder text"
                />
                <TextInput style={{ marginBottom: '2rem' }}
                  invalidText="Invalid error message."
                  labelText="Code"
                  placeholder="Placeholder text"
                />
                <TextInput style={{ marginBottom: '2rem' }}
                  invalidText="Invalid error message."
                  labelText="Remarks"
                  placeholder="Placeholder text"
                />
                <TextInput style={{ marginBottom: '2rem' }}
                  invalidText="Invalid error message."
                  labelText="Tag"
                  placeholder="Placeholder text"
                />
              </div>
            </div>
          </Form>
        </Modal>,
        document.body
      ))
  }

  //  admnistra o que acontece quando clica para abrir um documento PDF da aba "LEP"
  const handleOpenDocument = async (aplicabilidade, docType) => {
    let formData = new FormData();
    
    formData.append("remark", aplicabilidade);
    formData.append("manualName", nomeManual);
    formData.append("docType", docType)

    await fetch(`http://localhost:8585/pdfpage/novoPDF`, {
      method: 'POST',
      body: formData
    })

    // ----------------------------------------------------
    formData = new FormData();
    formData.append("remark", aplicabilidade);
    formData.append("manualName", nomeManual);
    formData.append("revision", 7)
    formData.append("docType", docType)

    const arrayBuffer = await fetch(`http://localhost:8585/ManualDocuments`, {
      method: 'POST',
      body: formData
    }).then(response => {
        if (response.status === 200) {
          return response.arrayBuffer();
        }
        if (response.status === 404) {
          setErrorMessage({open: true, title: 'Document not found', message: 'Please contact your system admin'});
          return undefined;
        }
      })

    if (arrayBuffer) {
      const file = new Blob([arrayBuffer], {
        type: 'application/pdf',
      });

      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    }
  }

  const handleProcessClick = async () => {
    await fetch(`http://localhost:8585/pdfpage?manualName=${nomeManual}`)
  }

  return (
    <>
      {drawNewBlockModal()}

      {reactDom.createPortal(
        <Modal
          open={errorMessage.open}
          onRequestClose={() => setErrorMessage({open: false})}
          modalHeading={errorMessage.title}
          modalLabel=""
          passiveModal>
          {errorMessage.message}
        </Modal>, document.body)}

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/">
          <ArrowLeft32 />
        </Link>
      </div>

      <div style={{ backgroundColor: "#f4f4f4" }}>
        <TableContainer title={nomeManual} description="Manual Details">
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
                            New Block
                          </span>
                          <Button hasIconOnly size="sm" renderIcon={Add16} iconDescription="Add New" tooltipPosition="right" onClick={() => setOpen(!isOpen)} />
                        </div>
                      </TableToolbarContent>
                      <TableToolbarContent>
                        <Link to={`/EditCodeList/${nomeManual}`}>
                          <Button>Edit Codelist</Button>
                        </Link>
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                      <TableHead style={{ fontSize: '12px' }}>
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
                      <TableBody style={{ fontSize: '12px' }}>
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

            <Tab id="Tab2" label="Manual Documents">
              <DataTable rows={lepList} headers={headersTableLEP}>
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
                        <Button onClick={handleProcessClick}>Process Master</Button>
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                      <TableHead style={{ fontSize: '12px' }}>
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
                      <TableBody style={{ fontSize: '12px' }}>
                        {rows.map((row, index) => (
                          <TableRow {...getRowProps({ row })}>
                            <TableCell key={"full"}>
                              <Button
                                hasIconOnly
                                size="sm"
                                kind="ghost"
                                renderIcon={Book24}
                                iconDescription="Open Document"
                                tooltipPosition="right"
                                onClick={() => handleOpenDocument(lepList[index].aplicabilidade, "FULL")} />
                            </TableCell>
                            <TableCell key={"delta"}>
                              <Button
                                hasIconOnly
                                size="sm"
                                kind="ghost"
                                renderIcon={Document24}
                                iconDescription="Open Document"
                                tooltipPosition="right"
                                onClick={() => handleOpenDocument(lepList[index].aplicabilidade, "DELTA")} />
                            </TableCell>
                            <TableCell key={"lep"}>
                              <Button
                                hasIconOnly
                                size="sm"
                                kind="ghost"
                                renderIcon={DocumentView24}
                                iconDescription="Open Document"
                                tooltipPosition="right"
                                onClick={() => handleOpenDocument(lepList[index].aplicabilidade, "LEP")} />
                            </TableCell>
                            <TableCell key={"remarks"}>
                              {lepList[index].aplicabilidade}
                            </TableCell>
                            <TableCell key={"name"}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  backgroundColor: "#e0e0e0",
                                  color: "#262626",
                                  padding: ".5rem",
                                  borderRadius: "1rem",
                                  border: ".5px solid #b0b0b0"
                                }}>
                                <strong style={{ width: "40%" }}>
                                  {lepList[index].tag}
                                </strong>
                                <div>REVISION 00</div>
                              </div>
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
