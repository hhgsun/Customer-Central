import React, { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs';
import { UPLOAD_FORM_URL } from '../config';

export default function AnswerItemValue({ answerIndex, answerValues, inputtype, isEdit = false, isAdmin = false, handle }) {

  const [values, setValues] = useState(answerValues)

  const [selectBoxIndex, setSelectBoxIndex] = useState(0)

  useEffect(() => {
    handle(answerIndex, values);
  }, [values])


  useEffect(() => {
    if (inputtype === "text" || inputtype === "textarea") {
      if (values.length === 0) {
        addVal();
      }
    } else if (inputtype === "selectbox") {
      values.forEach((v, i) => {
        if (v.select) setSelectBoxIndex(i);
      });
    }
  }, [inputtype]);

  const addVal = () => {
    setValues(prevState => ([
      ...values,
      { val: "", score: "Puanlayınız" }
    ]));
  }

  const deleteVal = (index) => {
    let filtered = values.filter((v, i) => i !== index);
    setValues(filtered)
  }

  const updateVal = (event, index) => {
    const newValues = [
      ...values.slice(0, index),
      { ...values[index], val: event.target.value },
      ...values.slice(index + 1)
    ]
    setValues(newValues)
  }

  const updateSelectBox = (event) => {
    const index = event.target.selectedIndex;
    const newValues = []
    values.forEach((element, i) => {
      if (i === index) {
        element.select = true;
        setSelectBoxIndex(i)
      }
      else
        element.select = false;
      newValues.push(element)
    });
    setValues(newValues)
  }

  const updateMultiCheck = (event, index) => {
    const newValues = [
      ...values.slice(0, index),
      { ...values[index], select: !values[index].select },
      ...values.slice(index + 1)
    ]
    setValues(newValues)
  }

  const updateImage = (event, index) => {
    const newValues = [...values];
    [...event.target.files].forEach((file) => {
      if (file) {
        const saveObj = {
          file: file,
          fileName: Date.now().toString() + "__" + file.name,
          newAddedUrl: URL.createObjectURL(file),
          score: values[index]["score"]
            ? values[index]["score"]
            : "Puanlayınız",
        };
        if (event.target.files.length > 1) {
          newValues.push(saveObj);
        } else {
          newValues[index] = saveObj;
        }
      }
    });
    setValues(prevState => ([...newValues]));
  }

  const updateScore = (event, index) => {
    const newValues = [
      ...values.slice(0, index),
      { ...values[index], score: event.target.value },
      ...values.slice(index + 1)
    ]
    setValues(newValues)
  }

  // default input
  var input = values.length > 0 & !isAdmin ? (<input name="value" value={values[0].val} onChange={(e) => updateVal(e, 0)} type="text" />) : "";

  if (inputtype === "textarea") {

    // textarea
    input = values.length > 0 & !isAdmin ? (<textarea name="value" value={values[0].val} onChange={(e) => updateVal(e, 0)} />) : "";

  } else if (inputtype === "checkbox") {

    // Checkbox
    input = <input type="checkbox" checked={values[0] ? values[0].select : false} onChange={(e) => updateMultiCheck(e, 0)} className="form-check-input me-2 mb-1" />

  } else if (inputtype === "multi-checkbox" || inputtype == "multi-checkbox-normal") {

    // Checkboxes
    input = isEdit ?
      <>
        <ReactSortable list={values} setList={setValues} className="d-inline-flex flex-wrap w-100 align-items-start">
          {values.map((v, i) =>
            <div key={i} className="multiple-item">
              <input className="form-control" value={v.val} onChange={(e) => updateVal(e, i)} />
              <span className="btn btn-sm btn-secondary" onClick={() => deleteVal(i)}><i className="bi bi-x-lg"></i></span>
            </div>
          )}
        </ReactSortable>
        <span href="#" className="btn btn-sm btn-dark" onClick={addVal}><i className="bi bi-plus-lg"></i></span>
      </>
      :
      (
        inputtype === "multi-checkbox" ?
          <div className="d-flex row gx-2 mx-0">
            <ul className="col list-group position-relative answer-checkbox-list">
              {values.map((v, i) =>
                !v.select ? <li key={i} className="d-flex list-group-item list-group-item-action bg-transparent">
                  {v.val}
                  <span className="cursor text-dark ms-auto" onClick={(e) => updateMultiCheck(e, i)}><i className="bi bi-plus-circle"></i></span>
                </li> : null
              )}
            </ul>
            <ul className="col list-group position-relative answer-checkbox-list">
              {values.map((v, i) =>
                v.select === true ? <li key={i} className="d-flex list-group-item list-group-item-action bg-transparent">
                  {v.val}
                  <span className="cursor text-danger ms-auto" onClick={(e) => updateMultiCheck(e, i)}><i className="bi bi-x-circle"></i></span>
                </li> : null
              )}
            </ul>
          </div>
          :
          <ul className="list-group list-group-horizontal">
            {values.map((v, i) =>
              <li key={i} className="list-group-item bg-transparent">
                <label className="form-check-label">
                  <input type="checkbox" checked={v.select} onChange={(e) => updateMultiCheck(e, i)} className="form-check-input me-2" />
                  {v.val}
                </label>
              </li>
            )}
          </ul>
      )

  } else if (inputtype === "selectbox") {

    // Selectbox
    input = isEdit ?
      <>
        <ReactSortable list={values} setList={setValues} className="d-flex flex-wrap align-items-start">
          {values.map((v, i) =>
            <div key={i} className="multiple-item">
              <input className="form-control" value={v.val} onChange={(e) => updateVal(e, i)} />
              <span className="btn btn-sm btn-secondary" onClick={() => deleteVal(i)}><i className="bi bi-x-lg"></i></span>
            </div>
          )}
        </ReactSortable>
        <span href="#" className="btn btn-sm btn-dark" onClick={addVal}><i className="bi bi-plus-lg"></i></span>
      </>
      :
      <select value={selectBoxIndex} onChange={(e => updateSelectBox(e))}>
        {values.map((v, i) =>
          <option key={i} value={i}>{v.val}</option>
        )}
      </select>

  } else if (inputtype === "color") {

    // Colors
    input = <>
      <ReactSortable list={values} setList={setValues} className="d-flex flex-wrap align-items-start">
        {values.map((v, i) =>
          <div key={i} className="multiple-item">
            <input type="color" value={v.val} onChange={(e) => updateVal(e, i)} />
            {isEdit ? <span className="btn btn-sm btn-secondary" onClick={() => deleteVal(i)}><i className="bi bi-x-lg"></i></span> : <></>}
          </div>
        )}
      </ReactSortable>
      {isEdit ? <span href="#" className="btn btn-sm btn-dark" onClick={addVal}><i className="bi bi-plus-lg"></i></span> : <></>}
    </>

  } else if (inputtype === "images" || inputtype === "image-scoring") {

    // Images
    input = <>
      <ReactSortable list={values} setList={setValues} className="d-flex flex-wrap align-items-start multi-image">
        {values.map((v, i) =>
          <div key={i} className="multiple-item">
            {v.file
              ? <img src={v.newAddedUrl != null ? v.newAddedUrl : UPLOAD_FORM_URL + v.fileName} className="mw-100" />
              : <></>
            }
            {
              inputtype === "image-scoring"
                ? <select value={v.score} onChange={(e) => updateScore(e, i)}>
                  <option>Puanlayınız</option>
                  <option>Çok İyi</option>
                  <option>İyi</option>
                  <option>Orta</option>
                  <option>Kötü</option>
                </select> : <></>
            }
            {
              isEdit ? <>
                <input type="file" onChange={(e) => updateImage(e, i)} multiple={true} accept="image/*" />
                <span className="btn btn-sm btn-secondary" onClick={() => deleteVal(i)}><i className="bi bi-x-lg"></i></span>
              </> : <></>
            }
          </div>
        )}
      </ReactSortable>
      {isEdit ? <span href="#" className="btn btn-sm btn-dark" onClick={addVal}><i className="bi bi-plus-lg"></i> Yeni Dosya Ekle</span> : <></>}
    </>

  }

  return input;
};
