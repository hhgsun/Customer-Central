import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import MaterialList from '../components/MaterialList';
import ClientModel from '../models/ClientModel';
import ClientService from '../services/clientService';
import { addClient, deleteClient, updateClient } from '../store/clientSlice';

export default function ClientEditPage() {

  const { clientId } = useParams()

  const history = useHistory()

  const dispacth = useDispatch()

  const [clientData, setClientData] = useState(new ClientModel());

  const [isLoad, setIsLoad] = useState(false);

  const clientService = new ClientService();

  useEffect(() => {
    if (clientId) {
      clientService.getClientDetail(clientId).then(res => {
        setClientData(Object.assign({}, new ClientModel(res)));
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, [])

  const sendClient = () => {
    clientService.addClient(clientData).then((id) => {
      dispacth(addClient({ ...clientData, id: id }));
    });
  }

  const sendUpdateClient = () => {
    clientService.updateClient(clientData).then(r => {
      dispacth(updateClient(clientData));
    })
  }

  const removeClient = (e) => {
    const s = window.confirm("Client i silmek üzeresiniz.")
    if (!s) return;
    clientService.deleteClient(clientId).then(r => {
      dispacth(deleteClient(clientId))
      history.push("/dashboard/clients");
      window.location.reload();
    })
  }

  /* */

  const handleInput = (e) => {
    setClientData(prevState => ({
      ...clientData,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="client-edit-page">

      <div className="d-flex">
        <h2 className="h5">{clientId ? 'Update Client' : 'Add New Client'}</h2>
        {isLoad && clientId
          ? <div className="ms-auto">
            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeClient(e)}>Delete Client</button>
          </div>
          : <></>}
      </div>

      {
        isLoad
          ?
          <>
            <input name="title" value={clientData.title} onChange={handleInput} className="form-control mt-3" placeholder="Client Title" />

            <h4 className="h5 mb-2 pb-3 d-flex align-items-end sticky-top bg-white border-bottom mt-1 pt-3" style={{ zIndex: '2', top: '55px' }}>
              Materials
              <div className="ms-auto">
                {clientData.id !== null
                  ? <>
                    <a href={`/client/${clientId}`} className="btn btn-sm btn-outline-dark" target="_blank" rel="noreferrer"><i className="bi bi-eye"></i> VİEW</a>
                    <button className="btn btn-dark btn-sm ms-2" onClick={sendUpdateClient}>UPDATE CLIENT</button>
                  </>
                  : <button className="btn btn-dark btn-sm ms-2" onClick={sendClient}>SEND CLIENT</button>}
              </div>
            </h4>

            <div style={{ minHeight: "25vh" }}>
              <MaterialList clientData={clientData} setClientData={setClientData} />
            </div>
          </>
          :
          <div>Bekleyiniz...</div>
      }
    </div>
  )
}
