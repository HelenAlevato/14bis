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
  FileUploader
} from 'carbon-components-react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';

var desenharCadastro = false;

const rows = [
  {
    id: 'a',
    manuais: 'ABC-1234',
    URL: 'c://Embraer/...',
  },
  {
    id: 'b',
    manuais: 'DEF-5678',
    URL: 'c://Embraer/...',
  },
  {
    id: 'c',
    manuais: 'GHI-9101',
    URL: 'c://Embraer/...',
  },
];

const headers = [
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
];

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const history = useHistory();
  
  const redirectToCodelist = async () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

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
            open={open}
            onRequestClose={() => setOpen(false)}
            onRequestSubmit={() => redirectToCodelist()}
            modalHeading="Criar um novo manual"
            modalLabel="Recursos do manual"
            primaryButtonText="Add"
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
            />
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
          TableToolbarAction,
        }) => (
          <TableContainer title="Manuais" description="Gerencie seus manuais">
            <TableToolbar>
              <TableToolbarContent>
                {/* pass in `onInputChange` change here to make filtering work */}
                <TableToolbarSearch onChange={onInputChange} />
                <TableToolbarMenu>
                  <TableToolbarAction onClick={() => { }}>
                    Action 1
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => { }}>
                    Action 2
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => { }}>
                    Action 3
                  </TableToolbarAction>
                </TableToolbarMenu>
                <Button onClick={() => setOpen(true)}>Cadastrar Manual</Button>
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
          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

export default HomePage;
