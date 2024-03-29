import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import AnswerList from '../components/AnswerList';
import FormModel from '../models/FormModel';
import FormService from '../services/formService';
import { updateForm } from '../store/formSlice';
import { setCurrentPageTitle } from '../store/utilsSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FormViewPage() {
  const { formId } = useParams()

  const dispatch = useDispatch();

  const [formData, setFormData] = useState(new FormModel());

  const [isLoad, setIsLoad] = useState(false);
  const [isWait, setIsWait] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const [selectedCatName, setSelectedCatName] = useState("");

  const formService = new FormService();

  useEffect(() => {
    setIsLoad(false);
    dispatch(setCurrentPageTitle("Brief View ..."));
    if (formId === null) {
      setIsLoad(true);
      return;
    }
    formService.getFormDetail(formId).then(res => {
      dispatch(setCurrentPageTitle("Brief: " + res.title));
      setFormData(res);
      setIsLoad(true);
    });
  }, [formId]);

  const sendUpdateForm = () => {
    setIsWait(true);
    const newData = {
      ...formData,
      isAnswered: 1
    }
    setFormData(newData);
    formService.updateForm(newData).then(r => {
      dispatch(updateForm(newData));
      setIsWait(false);
      setIsAnswered(true);
    })
  }

  return (
    <div className="form-view">
      <FormHeader isLoad={isLoad} formData={formData} setSelectedCatName={setSelectedCatName} />
      <main className="brief-main pt-4 pb-4">
        <div className="container-brief">
          {
            isLoad
              ? <AnswerList formData={formData} setFormData={setFormData} filterCatName={selectedCatName} />
              : <LoadingSpinner />
          }
        </div>
      </main>
      <div className="form-actions">
        <div className="container-brief pb-5">
          <button className="btn btn-dark py-3 px-4" onClick={(e) => sendUpdateForm()} disabled={isWait}>{formData.isAnswered == 1 ? "FORMU KAYDET" : "FORMU GÖNDER"}</button>
          {isAnswered ? <span className="ms-3">Teşekkürler! Vermiş olduğunuz bilgiler ekibimize iletilmiştir.</span> : <></>}
        </div>
      </div>
    </div>
  )
}

function FormHeader({ isLoad, formData, setSelectedCatName }) {
  const [catNames, setCatNames] = useState([])

  useEffect(() => {
    if (isLoad) {
      let filterCategoryNames = [];
      formData.answers.forEach((s) => {
        let catList = s.category.split(",");
        catList.forEach((cat) => {
          if (cat != null && cat != "" && !filterCategoryNames.includes(cat)) {
            filterCategoryNames.push(cat.trim());
          }
        });
      });
      setCatNames(filterCategoryNames);
      if (filterCategoryNames.length > 0) {
        setSelectedCatName(filterCategoryNames[0]);
      }
    }
  }, [isLoad])

  const changeSelect = (e) => {
    setSelectedCatName(e.target.value);
  }

  return (
    <header className="form-header pt-3">
      <div className="container-brief d-flex align-items-center">
        {isLoad & catNames.length > 0
          ? <label className="d-flex flex-column text-muted">
            <small>Kategori Seçiniz:</small>
            <select className="ms-0 mt-1" onChange={(e) => changeSelect(e)}>
              {catNames.map((c, i) => <option key={i}>{c}</option>)}
            </select>
          </label>
          : <></>
        }
      </div>
    </header>
  )
}
