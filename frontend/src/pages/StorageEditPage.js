import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MaterialList from '../components/MaterialList';
import SearchUser from '../components/SearchUser';
import StorageModel from '../models/StorageModel';
import StorageService from '../services/storageService';
import { addStorage, deleteStorage, updateStorage } from '../store/storageSlice';
import { toast } from 'react-toastify';

export default function StorageEditPage() {

  const { storageId } = useParams()

  const history = useHistory()

  const dispacth = useDispatch()

  const [storageData, setStorageData] = useState(new StorageModel());

  const [isLoad, setIsLoad] = useState(false);

  const [disabledBtn, setDisabledBtn] = useState(false)

  const storageService = new StorageService();

  const initData = () => {
    setDisabledBtn(true);
    storageService.getStorageDetail(storageId).then(res => {
      const data = new StorageModel(res);//Object.assign({}, new StorageModel(res));
      setStorageData(data);
      dispacth(updateStorage(data));
      setIsLoad(true);
      setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
    });
  }

  useEffect(() => {
    if (storageId) {
      initData()
    } else {
      setIsLoad(true);
    }
  }, [storageId])

  const sendStorage = () => {
    if (!storageData.title) {
      toast.warn("Lütfen başlığı belirtin.");
      return;
    }
    storageService.addStorage(storageData).then((id) => {
      dispacth(addStorage({ ...storageData, id: id }));
      history.push(`/admin/storage-edit/${id}`);
      toast.success("Storage Eklendi.");
    });
  }

  const sendUpdateStorage = () => {
    if (!storageData.title) {
      toast.warn("Lütfen başlığı belirtin.");
      return;
    }
    setDisabledBtn(true);
    storageService.updateStorage(storageData).then(r => {
      setDisabledBtn(false);
      initData();
      toast.success("Güncelleme Başarılı.");
    })
  }

  const removeStorage = (e) => {
    const s = window.confirm("Storage i silmek üzeresiniz.")
    if (!s) return;
    storageService.deleteStorage(storageId).then(r => {
      dispacth(deleteStorage(storageId))
      history.push("/admin/storages");
      window.location.reload();
    })
  }

  /* */

  const handleInput = (e) => {
    setStorageData(prevState => ({
      ...storageData,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="storage-edit-page">

      <div className="d-flex">
        <h2 className="h5 me-3">{storageId ? 'Update Storage' : 'Add New Storage'}</h2>
        <SearchUser data={storageData} setData={setStorageData} />

        {isLoad && storageId
          ? <div className="ms-auto">
            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeStorage(e)}>Delete Storage</button>
          </div>
          : <></>}
      </div>

      {
        isLoad
          ?
          <>
            <input name="title" value={storageData.title} onChange={handleInput} className="form-control mt-3" placeholder="Storage Title" />
            <input name="description" value={storageData.description} onChange={handleInput} className="form-control form-control-sm mt-1 text-muted" placeholder="Storage Description" />

            <h4 className="h5 mb-2 pb-3 d-flex align-items-end sticky-top bg-white border-bottom mt-1 pt-3" style={{ zIndex: '2', top: '55px' }}>
              Materials
              <div className="ms-auto">
                {storageData.id !== null
                  ? <>
                    <NavLink className="btn btn-sm btn-outline-dark" to={`/client/storage/${storageId}`} target={'_blank'} rel="noreferrer">
                      <i className="bi bi-eye"></i> VİEW
                    </NavLink>
                    <button className="btn btn-dark btn-sm ms-2" onClick={sendUpdateStorage} disabled={disabledBtn}>UPDATE STORAGE</button>
                  </>
                  : <button className="btn btn-dark btn-sm ms-2" onClick={sendStorage}>SEND STORAGE</button>}
              </div>
            </h4>

            <div style={{ minHeight: "25vh" }}>
              <MaterialList storageData={storageData} setStorageData={setStorageData} />
            </div>
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
