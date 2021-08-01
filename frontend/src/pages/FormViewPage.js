import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import SectionList from '../components/SectionList';
import FormModel from '../models/FormModel';
import FormService from '../services/formService';
import { updateForm } from '../store/formSlice';

export default function FormViewPage() {
  const { formId } = useParams()

  const dispacth = useDispatch();

  const [formData, setFormData] = useState(new FormModel());

  const [isLoad, setIsLoad] = useState(false);
  const [isWait, setIsWait] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const [selectedCatName, setSelectedCatName] = useState("");

  const formService = new FormService();

  useEffect(() => {
    if (formId === null) {
      setIsLoad(true);
      return;
    }
    formService.getFormDetail(formId).then(res => {
      setFormData(res);
      setIsLoad(true);
    });
  }, []);

  const sendUpdateForm = () => {
    setIsWait(true);
    const newData = {
      ...formData,
      status: 1
    }
    setFormData(newData);
    formService.updateForm(newData).then(r => {
      dispacth(updateForm(newData));
      setIsWait(false);
      setIsAnswered(true);
    })
  }

  return (
    <div className="form-view">
      <FormHeader isLoad={isLoad} formData={formData} setSelectedCatName={setSelectedCatName} />
      <main className="brief-main pt-5 pb-4">
        <div className="container-brief">
          {
            isLoad
              ? <SectionList formData={formData} setFormData={setFormData} filterCatName={selectedCatName} />
              : <div>Bekleyiniz...</div>
          }
        </div>
      </main>
      <div className="form-actions">
        <div className="container-brief pb-5">
          <button className="btn btn-dark py-3 px-4" onClick={(e) => sendUpdateForm()} disabled={isWait}>{formData.status == 1 ? "FORMU KAYDET" : "FORMU GÖNDER"}</button>
          {isAnswered ? <span className="ms-3">Teşekkürler! Vermiş olduğunuz bilgiler ekibimize iletilmiştir.</span> : <></>}
        </div>
      </div>
      <FormFooter />
    </div>
  )
}

function FormHeader({ isLoad, formData, setSelectedCatName }) {
  const [catNames, setCatNames] = useState([])

  useEffect(() => {
    if (isLoad) {
      let filterCategoryNames = [];
      formData.sections.forEach((s) => {
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
    <header className="form-header py-4">
      <div className="container-brief d-flex py-2 align-items-center">
        <div className="header-head">
          <a href="http://thebluered.co.uk/" className="custom-logo-link logo-innerpage" rel="home" aria-current="page" title="The Blue Red">
            <img width="200" height="37" src="http://thebluered.co.uk/wp-content/uploads/2021/05/cropped-logo-1-e1621355087557.png" className="header-logo" alt="The Blue Red" />
          </a>
          <div className="header-head-subtitle">Brief central</div>
        </div>
        {isLoad & catNames.length > 0
          ? <div className="ms-auto">
            <label>
              Kategori Seçiniz:
              <select onChange={(e) => changeSelect(e)}>
                {catNames.map((c, i) => <option key={i}>{c}</option>)}
              </select>
            </label>
          </div>
          : <></>
        }
      </div>
    </header>
  )
}

function FormFooter() {
  return (
    <div className="brief-footer no-print">
      <div className="container-brief">
        <div className="site-info text-center py-4">
          <a href="http://thebluered.co.uk/" title="TheBlueRed" className="text-decoration-none small">
            Proudly powered by theBlueRed
          </a>
          <span style={{ display: "none" }}>
            dev by
            <a href="https://hhgsun.wordpress.com">HHGsun</a>.
          </span>
        </div>
      </div>
    </div>
  )
}