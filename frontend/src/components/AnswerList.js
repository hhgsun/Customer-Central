import AnswerModel from '../models/AnswerModel'
import AnswerItemValue from './AnswerItemValue';
import EmptyItemsMessage from './EmptyItemsMessage';

export default function answerList({ formData, setFormData, isAdmin = false, filterCatName = "" }) {

  const addanswer = () => {
    setFormData(prevState => ({
      ...formData,
      answers: [
        ...formData.answers,
        Object.assign({}, new AnswerModel())
      ]
    }));
  }

  const deleteanswer = (answerId, index) => {
    var c = window.confirm("Silmek istediğinize emin misiniz?")
    if (!c) return;
    if (formData.answers[index]) {
      let filtered = formData.answers.filter((s, i) => i !== index);
      console.log(filtered);
      let deletedIds = [];
      if (formData.answers[index].id != null) {
        deletedIds.push(formData.answers[index].id)
      }
      setFormData(prevState => ({
        ...formData,
        answers: filtered,
        deletedAnswerIds: [...formData.deletedAnswerIds, ...deletedIds]
      }));
    }
  }

  const updateVal = (answerIndex, values) => {
    let answers = [];
    formData.answers.forEach((s, index) => {
      if (answerIndex === index) {
        let answer = { ...s, value: values }
        answers.push(answer);
      } else {
        answers.push({ ...s });
      }
    });
    console.log(answers);
    setFormData(prevState => ({
      ...formData,
      answers: answers
    }));
  }

  const handleInputType = (event, answerIndex) => {
    let list = formData.answers.map((s, i) => {
      if (i === answerIndex) {
        let newSec = { ...s, [event.target.name]: event.target.value };
        if (s.value.length === 0) {
          newSec = { ...newSec, value: [{ val: "" }] }
        }
        return newSec;
      }
      return s;
    });
    setFormData(prevState => ({
      ...formData,
      answers: list
    }));
  }

  const handleInput = (event, answerIndex) => {
    let list = formData.answers.map((s, i) => {
      return i === answerIndex
        ? { ...s, [event.target.name]: event.target.value }
        : s
    });
    setFormData(prevState => ({
      ...formData,
      answers: list
    }));
  }

  const handleCheckbox = (event, answerIndex) => {
    let list = formData.answers.map((s, i) => {
      return i === answerIndex
        ? { ...s, [event.target.name]: event.target.checked ? "1" : "0" }
        : s
    });
    setFormData(prevState => ({
      ...formData,
      answers: list
    }));
  }

  return (
    <>
      {
        formData.answers.map((answer, answerIndex) => (
          answer.category.includes(filterCatName) || answer.category === "" ?
            <section key={answerIndex} className={`mb-3 position-relative form-answer answer-type-${answer.input_type} ${answer.category}`}>
              {
                isAdmin
                  ? <>
                    <div className={`d-flex mb-2 mt-4 ${answerIndex === 0 ? "" : "pt-4 border-top"}`}>
                      <input name="label" className="form-control form-control-sm w-50 bg-light border-dark" placeholder="Label" value={answer.label} onChange={(e) => handleInput(e, answerIndex)} />
                      <input name="description" className="form-control form-control-sm ms-2 w-50 bg-light" placeholder="Description" value={answer.description} onChange={(e) => handleInput(e, answerIndex)} />
                    </div>
                    <div className="answer-controls d-flex align-items-center mb-2">
                      <select name="input_type" value={answer.input_type} className="form-select-type form-select form-select-sm" onChange={(e) => handleInputType(e, answerIndex)} style={{ maxWidth: "150px" }}>
                        <option value="text">Inline Text</option>
                        <option value="textarea">Text Area</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="multi-checkbox">Checkboxes (Style)</option>
                        <option value="multi-checkbox-normal">Checkboxes (Normal)</option>
                        <option value="selectbox">Selecbox</option>
                        <option value="color">Colors</option>
                        <option value="images">Images</option>
                        <option value="image-scoring">Image Scoring</option>
                        <option value="file">File</option>
                      </select>
                      <input name="category" className="form-control form-control-sm ms-2 w-25" placeholder="Categories (Logo,Web,...)" value={answer.category} onChange={(e) => handleInput(e, answerIndex)} />
                      <div className="form-check small mt-1 ms-3">
                        <input name="permission_edit" type="checkbox" className="form-check-input" checked={answer.permission_edit === "1"} onChange={(e) => handleCheckbox(e, answerIndex)} /> Permission Edit
                      </div>
                      <div className="ms-auto">
                        <input name="order_number" type="number" className="border text-end" value={answer.order_number} onChange={(e) => handleInput(e, answerIndex)} style={{ maxWidth: "50px" }} /> <i className="bi bi-sort-numeric-down"></i>
                        <button type="button" onClick={() => deleteanswer(answer.id, answerIndex)} className="ms-2" style={{ border: 0, background: "none", marginBottom: "5px" }}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </>
                  : <>
                    <div className="answer-label">{answer.label} <small className="ms-1">{answer.description}</small></div>
                  </>
              }

              <AnswerItemValue
                answerIndex={answerIndex}
                answerValues={answer.value}
                inputtype={answer.input_type}
                isEdit={(isAdmin || answer.permission_edit) == true}
                isAdmin={isAdmin}
                handle={updateVal}
              />

            </section>
            : <span key={answerIndex}></span>
        ))
      }
      {
        formData.answers.length === 0 ? <EmptyItemsMessage /> : <></>
      }
      {
        isAdmin
          ? <>
            <div className="card mt-5">
              <button className="btn py-3" onClick={addanswer}>New answer</button>
            </div>
          </>
          : <></>
      }
    </>
  )
}