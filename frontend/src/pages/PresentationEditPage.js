import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import PresentationModel from '../models/PresentationModel';
import { UPLOAD_PRESENTATION_URL } from '../config';
import PresentationService from '../services/presentationService';
import { addPresentation, deletePresentation, updatePresentation } from '../store/presentationSlice';

export default function PresentationEditPage() {
  const { presentId } = useParams()

  const history = useHistory()

  const dispacth = useDispatch()

  const [presentationData, setPresentationData] = useState(new PresentationModel());

  const [isLoad, setIsLoad] = useState(false);

  const presentService = new PresentationService();

  useEffect(() => {
    if (presentId) {
      presentService.getPresentationDetail(presentId).then(res => {
        setPresentationData(Object.assign({}, new PresentationModel(res)));
        setIsLoad(true);

      });
    } else {
      setIsLoad(true);
    }
  }, [])

  const sendPresentation = () => {
    if (!presentationData.title) {
      alert("Lütfen Form Başlığı Belirtin.");
      return;
    }
    presentService.addPresentation(presentationData).then((id) => {
      dispacth(addPresentation({ ...presentationData, id: id }));
      history.push(`/dashboard/presentation-edit/${id}`);
      alert("Presentation Eklendi");
      window.location.reload();
    });
  }

  const sendUpdatePresentation = () => {
    if (!presentationData.title) {
      alert("Lütfen Form Başlığı Belirtin.");
      return;
    }
    presentService.updatePresentation(presentationData).then(r => {
      dispacth(updatePresentation(presentationData));
      alert("Güncelleme Başarılı");
    })
  }

  const removePresentation = (e) => {
    const s = window.confirm("Presentation u silmek üzeresiniz.")
    if (!s) return;
    presentService.deletePresentation(presentId).then(r => {
      dispacth(deletePresentation(presentId))
      history.push("/dashboard/presentations");
      window.location.reload();
    })
  }

  const handleInput = (e) => {
    setPresentationData(prevState => ({
      ...presentationData,
      [e.target.name]: e.target.value
    }))
  }

  const addNewImage = (e) => {
    setPresentationData(prevState => ({
      ...presentationData,
      images: [...presentationData.images, {}]
    }))
  }

  const setImagesSortable = (newImagesState) => {
    setPresentationData(prevState => ({
      ...presentationData,
      images: newImagesState
    }))
  }

  const updateImage = (event, index) => {
    const newValues = [...presentationData.images];
    [...event.target.files].forEach((file) => {
      if (file) {
        const saveObj = {
          file: file,
          fileName: Date.now().toString() + "__" + file.name,
          newAddedUrl: URL.createObjectURL(file),
          nativeName: file.name
        };
        if (event.target.files.length > 1) {
          newValues.push(saveObj);
        } else {
          newValues[index] = saveObj;
        }
      }
    });
    console.log("Update Image", newValues);
    setPresentationData(prevState => ({
      ...presentationData,
      images: newValues
    }));
  }

  const deleteImage = (index) => {
    var c = window.confirm("Silmek istediğinize emin misiniz?")
    if (!c) return;
    let filtered = presentationData.images.filter((v, i) => i !== index);
    setPresentationData(prevState => ({
      ...presentationData,
      images: filtered
    }))
  }

  return (
    <div className="presentation-edit-page">

      <div className="d-flex">
        <h2 className="h5">{presentId ? 'Update Presentation' : 'Add New Presentation'}</h2>
        {isLoad && presentId
          ? <div className="ms-auto">
            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removePresentation(e)}>Delete Presentation</button>
          </div>
          : <></>}
      </div>

      {
        isLoad
          ?
          <>
            <input name="title" value={presentationData.title} onChange={handleInput} className="form-control mt-3" placeholder="Presentation Title" />

            <h4 className="h5 mb-2 pb-3 d-flex align-items-end sticky-top bg-white border-bottom mt-1 pt-3" style={{ zIndex: '2', top: '55px' }}>
              IMAGES
              <div className="ms-auto">
                {presentationData.id !== null
                  ? <>
                    <NavLink className="btn btn-sm btn-outline-dark" to={`/presentation/${presentId}`} target={'_blank'} rel="noreferrer">
                      <i className="bi bi-eye"></i> VİEW
                    </NavLink>
                    <button className="btn btn-dark btn-sm ms-2" onClick={sendUpdatePresentation}>UPDATE PRESENTATION</button>
                  </>
                  : <button className="btn btn-dark btn-sm ms-2" onClick={sendPresentation}>SEND PRESENTATION</button>}
              </div>
            </h4>

            <div className="pb-5" style={{ minHeight: "25vh" }}>

              <ReactSortable list={presentationData.images} setList={setImagesSortable} className="mx-auto" style={{ maxWidth: "500px" }}>
                {presentationData.images.map((image, imageIndex) =>
                  <div key={imageIndex} className="card my-3">
                    {
                      image.fileName || image.newAddedUrl ?
                        <img src={image.newAddedUrl != null ? image.newAddedUrl : UPLOAD_PRESENTATION_URL + image.fileName} className="mw-100" />
                        : <></>
                    }
                    <div className="d-flex align-items-center p-1">
                      <label className="form-label btn btn-outline-dark mb-0">
                        {image.fileName ? image.nativeName : "SELECT IMAGE"}
                        <input type="file" onChange={(e) => updateImage(e, imageIndex)} hidden multiple={true} accept="image/*" />
                      </label>
                      <span className="btn btn-sm btn-secondary ms-auto" onClick={() => deleteImage(imageIndex)}><i className="bi bi-x-lg"></i></span>
                    </div>
                  </div>
                )}
              </ReactSortable>

              <a className="btn btn-sm btn-outline-dark my-4" onClick={(e) => addNewImage(e)}>NEW IMAGE</a>

            </div>
          </>
          :
          <div>Bekleyiniz...</div>
      }
    </div>
  )
}
