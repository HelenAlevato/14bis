import { ChevronRight20 } from '@carbon/icons-react';
import {
  Button,
  DataTable,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TextInput,
  FileUploader,
  OverflowMenuItem,
} from 'carbon-components-react';
import { OverflowMenu } from 'carbon-components-react/lib/components/OverflowMenu/OverflowMenu';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory } from 'react-router-dom';

const headers = [
  {
    key: 'actions',
    header: '',
  },
  {
    key: 'nomeManual',
    header: 'Nome do Manual',
  },
  {
    key: 'URL',
    header: 'URL',
  },
  {
    key: 'CreationDate',
    header: 'Data de Criação',
  },
  {
    key: 'visualizeAction',
    header: '',
  },
];

const HomePage = () => {
  // status do modal de manual, pode ser: "create" ou "edit"
  const [manualModalConfig, setManualModalConfig] = useState({ open: false, status: "create" });
  const [file, setFile] = useState();
  const [nomeManual, setNomeManual] = useState('');
  const history = useHistory();

  let [fetchedManuais, setFetchedManuais] = useState([]);
  let [manuais, setManuais] = useState([]);
  let [isLoaded, setLoaded] = useState(false);

  useEffect(async () => {
    if (!isLoaded) {
      setFetchedManuais(await fetch("http://localhost:8585/api/manual").then(response => response.json()))
      setManuais(fetchedManuais)
      setLoaded(true);
    }
  })

  const redirectToCodelist = async () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('nomeManual', nomeManual === "" ? "manual sem nome" : nomeManual)

      const opcoesRequest = {
        method: 'POST',
        body: formData
      };

      await fetch('http://localhost:8585/api/codelist/upload', opcoesRequest)
        .catch(err => console.log(err))
        .then(response => response.json())
        .then(data => history.push(`/CodeList/${nomeManual}`)
        );
    }
  }

  const atribuirArquivo = (data) => {
    setFile(data.target.files[0]);
  }

  const filtrarManuais = (e) => {
    let textoDeFiltro = e.target.value
    manuais = fetchedManuais
    setManuais(manuais.filter(manual => manual.nome.includes(textoDeFiltro)))
  }

  const handleModalClose = () => {
    setNomeManual("");
    setManualModalConfig({ open: false });
  }

  const handleModalSubmit = async () => {
    if (manualModalConfig.status === "create") {
      redirectToCodelist();
    } else {
      let formData = new FormData()
      formData.append('manualData', `${manualModalConfig.currentManual.codManual},${nomeManual}`)
      
      const opcoesRequest = {
        method: 'POST',
        body: formData,
      };

      await fetch('http://localhost:8585/api/manual/update', opcoesRequest);
      handleModalClose();
      setLoaded(false);
    }
  }

  return (
    <>
      {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
          <Modal
            open={manualModalConfig.open}
            onRequestClose={handleModalClose}
            onRequestSubmit={handleModalSubmit}
            modalHeading={manualModalConfig.status === "create" ? "Criar um novo manual" : "Editar Nome do Manual"}
            modalLabel="Recursos do manual"
            primaryButtonText="Save"
            secondaryButtonText="Cancel">
            <p style={{ marginBottom: '1rem' }}>
              Preencha os campos abaixo conforme o manual a ser cadastrado.
            </p>
            <TextInput
              data-modal-primary-focus
              id="text-input-1"
              labelTitle="Nome do manual"
              placeholder="ex: ABC-1234"
              style={{ marginBottom: '1rem' }}
              value={nomeManual ? nomeManual : ""}
              onChange={(data) => setNomeManual(data.target.value)}
            />
            {manualModalConfig.status === "create" ? (
              <FileUploader
                labelTitle="Arquivo Codelist"
                labelDescription="Apenas arquivos Excel"
                buttonLabel="Add Codelist"
                filenameStatus="edit"
                accept={[".xlsx", ".xltx"]}
                onChange={(data) => atribuirArquivo(data)}
                name="file"
                multiple={true}
              />
            ) : <></>}


          </Modal>,
          document.body
        )}
      <DataTable rows={manuais} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          onInputChange,
        }) => (
          <TableContainer title="Manuais" description="Gerencie seus manuais">
            <TableToolbar>
              <TableToolbarContent>
                {/* pass in `onInputChange` change here to make filtering work */}
                <TableToolbarSearch onChange={filtrarManuais} />
                <Button onClick={() => setManualModalConfig({ open: true, status: "create" })}>Cadastrar Manual</Button>
              </TableToolbarContent>
            </TableToolbar>
            {rows.length === 0 ? (
              <div style={{ backgroundColor: "#f4f4f4", display: "flex", alignItem: "center", alignContent: "center", padding: "2rem", borderTop: "3px solid #DDD" }}>
                <h4 style={{ fontWeight: 700, margin: "auto", fontFamily: "IBM Plex Sans" }}>Não há manuais cadastrados no sistema</h4>
              </div>
            ) : (
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
                  {manuais.map(manual => (
                    <TableRow key={manual.nome}>
                      <TableCell key={"actions"}>
                        <OverflowMenu selectorPrimaryFocus={'.optionTwo'}>
                          <OverflowMenuItem
                            onClick={() => setManualModalConfig({ open: true, status: "edit", currentManual: manual })}
                            itemText="Editar Manual"
                          />
                        </OverflowMenu>
                      </TableCell>
                      <TableCell key="nomeManual">{manual.nome}</TableCell>
                      <TableCell key="URL">C://Embraer/...</TableCell>
                      <TableCell key="CreationDate">{manual.date.split('T')[0]}</TableCell>
                      <TableCell key={"visualizeAction"}>
                        <Link to={`/CodeList/${manual.nome}`}>
                          <ChevronRight20 style={{ cursor: "pointer" }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

export default HomePage;