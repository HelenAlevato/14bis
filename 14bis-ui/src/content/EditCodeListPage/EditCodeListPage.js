import { Add16, Add20, Add32, ArrowLeft32, MisuseOutline16 } from "@carbon/icons-react"
import {
    Button,
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent,
    Form,
    TextInput,
    TableContainer,
    TableToolbarSearch
} from "carbon-components-react"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

const headers = [
    {
        style: { width: '10%' },
        key: 'secao',
        header: 'Nº Seção',
    },
    {
        style: { width: '12%' },
        key: 'subSecao',
        header: 'Nº Sub Seção',
    },
    {
        style: { width: '10%' },
        key: 'bloco',
        header: 'Nº Bloco',
    },
    {
        key: 'blockName',
        header: 'Block Name',
    },
    {
        style: { width: '10%' },
        key: 'code',
        header: 'Code',
    },
    {
        key: 'remarks',
        header: 'Remarks',
    },
    {
        key: '',
        header: '',
    },
]


const EditCodeListPage = () => {
    var [codelist, setCodelist] = useState([]);
    var [fetchedCodelist, setFetchedCodelist] = useState([]);
    var [isLoaded, setLoaded] = useState(false);

    var [blocosRemovidos, setBlocosRemovidos] = useState([]);
    const history = useHistory();

    let nomeManual = useParams().nomeManual;

    // função ativada quando a tela é redesenhada
    useEffect(async () => {
        // se não tiver carregado os dados do manual, ele vai carregar 1 vez
        if (!isLoaded) {
            let response = await fetch(`http://localhost:8585/api/codelist/manual/${nomeManual}`).then(response => response.json());
            setFetchedCodelist(response);
            setCodelist(fetchedCodelist);
            setLoaded(true);
        }
    })

    // função nao finalizada, nao está pronta ainda
    const filtrarCodelist = (e) => {
        // let textoDeFiltro = e.target.value
        // codelist = fetchedCodelist
        // setCodelist(codelist.filter(bloco => bloco.nome.includes(textoDeFiltro)))
    }

    // permite remover a linha do codelist escolhida, 
    // atualizando a nossa lista de blocos e fazer a pagina redesenhar 
    const removerBloco = (e, index) => {
        setCodelist(codelist.filter((bloco, blocoIndex) => {
            if (blocoIndex === index) {
                blocosRemovidos.push(bloco)
            }
            return blocoIndex !== index
        }))
        setBlocosRemovidos(blocosRemovidos)
    }

    // (não utilizada no momento) função para atualizar linha do bloco
    const onBlocoChange = (value, blocoIndex) => {
        this.setState({
            name: value
        });
    }

    // admnistra o que acontece quando um texto do bloco é alterado
    const updateCodelist = (blocoAlterado, blocoIndex) => {
        let novoCodelist = codelist.map((bloco, index) => {
            if (blocoIndex === index) {
                bloco = blocoAlterado;
            }
            return bloco;
        })
        setCodelist(novoCodelist);
    }

    // admnistra o que acontece quando clica no "cancelar" da pagina
    const handleCancel = () => {
        history.push(`/CodeList/${nomeManual}`)
    }

    // admnistra o que acontece quando clica no "salvar" da pagina
    const handleSave = async () => {
        await handleDeleteBlocks()
    }

    // informa à API para remover os blocos que não existem mais na tela
    const handleDeleteBlocks = async () => {
        let idsToDelete = [];
        idsToDelete = blocosRemovidos.map(bloco => bloco.id).join(",");

        console.log("ids a serem deletados", idsToDelete)

        const formData = new FormData();
        formData.append('idsToDelete', idsToDelete);

        const opcoesRequest = { method: 'POST', body: formData };

        await fetch('http://localhost:8585/api/codelist/delete', opcoesRequest)
            .catch(err => console.log(err))
            .then(response => response.json())
            .then(data => history.push(`/CodeList/${nomeManual}`)
            );
    }

    return (
        <div>
            <ArrowLeft32 style={{ cursor: "pointer" }} onClick={() => history.goBack()} />
            <Form>
                <DataTable rows={codelist} headers={headers}>
                    {({
                        rows,
                        headers,
                        getHeaderProps,
                        getRowProps,
                        getTableProps,
                        onInputChange
                    }) => (

                        <TableContainer title={`Edição do ${nomeManual}`} description="Edite as linhas do codelist">
                            <TableToolbar>
                                <TableToolbarContent>
                                    <TableToolbarSearch onChange={filtrarCodelist} />
                                </TableToolbarContent>
                            </TableToolbar>
                            <Table {...getTableProps()} size='short'>
                                <TableHead style={{ fontSize: '10px' }}>
                                    <TableRow>
                                        {headers.map(header => (
                                            <TableHeader
                                                style={header.style}
                                                key={header.key}
                                                {...getHeaderProps({ header })}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {codelist.map((bloco, index) => (

                                        <TableRow key={bloco.id} style={{ fontSize: '5px' }}>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem', padding: 0, textAlign: 'center' }}
                                                    placeholder=""
                                                    value={bloco.secao}
                                                    onChange={e => { bloco.secao = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem', padding: 0, textAlign: 'center' }}
                                                    value={bloco.subSecao ? bloco.subSecao : '-'}
                                                    onChange={e => { bloco.subSecao = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem', padding: 0, textAlign: 'center' }}
                                                    value={bloco.bloco}
                                                    onChange={e => { bloco.bloco = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem' }}
                                                    value={bloco.nomeBloco}
                                                    onChange={e => { bloco.nomeBloco = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem', padding: 0, textAlign: 'center' }}
                                                    value={bloco.codigo}
                                                    onChange={e => { bloco.codigo = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextInput
                                                    size="sm"
                                                    style={{ fontSize: '0.65rem' }}
                                                    value={bloco.aplicabilidade}
                                                    onChange={e => { bloco.aplicabilidade = e.target.value; updateCodelist(bloco, index) }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <MisuseOutline16 style={{ fill: 'red' }} onClick={(e) => removerBloco(e, index)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DataTable>

                <div style={{ display: 'flex' }}>
                    <Button
                        kind="secondary"
                        style={{ flexGrow: 1, padding: 0, justifyContent: 'center' }} onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button style={{ flexGrow: 1, padding: 0, justifyContent: 'center' }} onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default EditCodeListPage;