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
import { Link } from 'react-router-dom';

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

  return (
    <>
      {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
            // <ComposedModal open={open} onClose={() => setOpen(false)}>
            // <ModalHeader />
            //     <ModalBody>
            //         <p className="bx--modal-content__text">
            //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            //         cursus fermentum risus, sit amet fringilla nunc pellentesque quis. Duis
            //         quis odio ultrices, cursus lacus ac, posuere felis. Donec dignissim libero
            //         in augue mattis, a molestie metus vestibulum. Aliquam placerat felis
            //         ultrices lorem condimentum, nec ullamcorper felis porttitor.
            //         </p>
            //     </ModalBody>
            // </ComposedModal>,
            <Modal
              open={open}
              onRequestClose={() => setOpen(false)}
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
                  labelDescription="apenas arquivos .jpg e .png de 500 MB ou menos"
                  buttonLabel="Add Codelist"
                  filenameStatus="edit"
                  accept={[".xlsx", ".xltx"]}
                  onChange={console.log}
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
                  <TableToolbarAction onClick={() => {}}>
                    Action 1
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => {}}>
                    Action 2
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => {}}>
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
