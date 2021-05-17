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
  TableToolbarMenu,
  TableToolbarSearch,
  TextInput,
  FileUploader,
  TooltipIcon,
  OverflowMenuItem
} from 'carbon-components-react';
import { OverflowMenu } from 'carbon-components-react/lib/components/OverflowMenu/OverflowMenu';
import { Tooltip } from 'carbon-components-react/lib/components/Tooltip/Tooltip';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory } from 'react-router-dom';

const rows = [
  {
    id: 'a',
    manuais: 'ABC-1234',
    URL: 'c://Embraer/...',
    CreationDate: '',
  },
  {
    id: 'b',
    manuais: 'DEF-5678',
    URL: 'c://Embraer/...',
    CreationDate: '',
  },
  {
    id: 'c',
    manuais: 'GHI-9101',
    URL: 'c://Embraer/...',
    CreationDate: '',
  },
];

const headers = [
  {
    key: 'actions',
    header: '',
  },
  {
    key: 'manuais',
    header: 'Manuais',
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
  const [nomeManual, setNomeManual] = useState('manual sem nome');
  const history = useHistory();

  const redirectToCodelist = async () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('nomeManual', nomeManual)

      const opcoesRequest = {
        method: 'POST',
        body: formData
      };

      await fetch('http://localhost:8585/api/codelist/upload', opcoesRequest)
        .catch(err => console.log(err))
        .then(response => response.json())
        .then(data => history.push("/CodeList")
        );
    }
  }

  const atribuirArquivo = (data) => {
    setFile(data.target.files[0]);
  }

  return (
    <>
      {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
          <Modal
            open={manualModalConfig.open}
            onRequestClose={() => setManualModalConfig({ open: false })}
            onRequestSubmit={() => manualModalConfig.status === "create" ? redirectToCodelist() : setManualModalConfig({ open: false })}
            modalHeading={manualModalConfig.status === "create" ? "Criar um novo manual" : "Editar Manual"}
            modalLabel="Recursos do manual"
            primaryButtonText="Save"
            secondaryButtonText="Cancel">
            {manualModalConfig.status === "create" ? (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  Preencha os campos abaixo conforme o manual a ser cadastrado.
                </p>
                <TextInput
                  data-modal-primary-focus
                  id="text-input-1"
                  labelTitle="Nome do manual"
                  placeholder="ex: ABC-1234"
                  style={{ marginBottom: '1rem' }}
                  onChange={(data) => setNomeManual(data.target.value)}
                />
              </>
            ) : <></>}

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
          </Modal>,
          document.body
        )}
      <DataTable rows={rows} headers={headers}>
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
                <TableToolbarSearch onChange={onInputChange} />
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
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell>
                        <h4>Não há manuais cadastrados no sistema</h4>
                      </TableCell>
                    </TableRow>
                  ) : <></>}
                  {rows.map(row => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      <TableCell key={"actions"}>
                        <OverflowMenu selectorPrimaryFocus={'.optionTwo'}>
                          <OverflowMenuItem
                            onClick={() => setManualModalConfig({ open: true, status: "edit" })}
                            itemText="Editar Manual"
                          />
                        </OverflowMenu>
                      </TableCell>
                      {row.cells.map(cell => cell.value !== undefined ? (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ) : <></>)}
                      <TableCell key={"visualizeAction"}>
                        <Link to="/CodeList">
                          <ChevronRight20 style={{cursor: "pointer"}}/>
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