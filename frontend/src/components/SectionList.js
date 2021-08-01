import SectionModel from '../models/SectionModel'
import SectionItemValue from './SectionItemValue';

export default function SectionList({ formData, setFormData, isAdmin = false, filterCatName = "" }) {

  const addSection = () => {
    setFormData(prevState => ({
      ...formData,
      sections: [
        ...formData.sections,
        Object.assign({}, new SectionModel())
      ]
    }));
  }

  const deleteSection = (sectionId, index) => {
    var c = window.confirm("Silmek istediğinize emin misiniz?")
    if (!c) return;
    if (formData.sections[index]) {
      let filtered = formData.sections.filter((s, i) => i !== index);
      console.log(filtered);
      let deletedIds = [];
      if (formData.sections[index].id != null) {
        deletedIds.push(formData.sections[index].id)
      }
      setFormData(prevState => ({
        ...formData,
        sections: filtered,
        deletedSectionIds: [...formData.deletedSectionIds, ...deletedIds]
      }));
    }
  }

  const updateVal = (sectionIndex, values) => {
    let sections = [];
    formData.sections.forEach((s, index) => {
      if (sectionIndex === index) {
        let section = { ...s, value: values }
        sections.push(section);
      } else {
        sections.push({ ...s });
      }
    });
    setFormData(prevState => ({
      ...formData,
      sections: sections
    }));
  }

  const handleInputType = (event, sectionIndex) => {
    let list = formData.sections.map((s, i) => {
      if (i === sectionIndex) {
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
      sections: list
    }));
  }

  const handleInput = (event, sectionIndex) => {
    let list = formData.sections.map((s, i) => {
      return i === sectionIndex
        ? { ...s, [event.target.name]: event.target.value }
        : s
    });
    setFormData(prevState => ({
      ...formData,
      sections: list
    }));
  }

  const handleCheckbox = (event, sectionIndex) => {
    let list = formData.sections.map((s, i) => {
      return i === sectionIndex
        ? { ...s, [event.target.name]: event.target.checked ? "1" : "0" }
        : s
    });
    setFormData(prevState => ({
      ...formData,
      sections: list
    }));
  }

  return (
    <>
      {
        formData.sections.map((section, sectionIndex) => (
          section.category.includes(filterCatName) || section.category === "" ?
            <section key={sectionIndex} className={`mb-3 position-relative form-section section-type-${section.input_type} ${section.category}`}>
              {
                isAdmin
                  ? <>
                    <div className={`d-flex mb-2 mt-4 ${sectionIndex === 0 ? "" : "pt-4 border-top"}`}>
                      <input name="label" className="form-control form-control-sm w-50 bg-light border-dark" placeholder="Label" value={section.label} onChange={(e) => handleInput(e, sectionIndex)} />
                      <input name="description" className="form-control form-control-sm ms-2 w-50 bg-light" placeholder="Description" value={section.description} onChange={(e) => handleInput(e, sectionIndex)} />
                    </div>
                    <div className="section-controls d-flex align-items-center mb-2">
                      <select name="input_type" value={section.input_type} className="form-select-type form-select form-select-sm" onChange={(e) => handleInputType(e, sectionIndex)} style={{ maxWidth: "150px" }}>
                        <option value="text">Inline Text</option>
                        <option value="textarea">Text Area</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="multi-checkbox">Checkboxes (Style)</option>
                        <option value="multi-checkbox-normal">Checkboxes (Normal)</option>
                        <option value="selectbox">Selecbox</option>
                        <option value="color">Colors</option>
                        <option value="images">Images</option>
                        <option value="image-scoring">Image Scoring</option>
                      </select>
                      <input name="category" className="form-control form-control-sm ms-2 w-25" placeholder="Categories (Logo,Web,...)" value={section.category} onChange={(e) => handleInput(e, sectionIndex)} />
                      <div className="form-check small mt-1 ms-3">
                        <input name="permission_edit" type="checkbox" className="form-check-input" checked={section.permission_edit === "1"} onChange={(e) => handleCheckbox(e, sectionIndex)} /> Permission Edit
                      </div>
                      <div className="ms-auto">
                        <input name="order_number" type="number" className="border text-end" value={section.order_number} onChange={(e) => handleInput(e, sectionIndex)} style={{ maxWidth: "50px" }} /> <i className="bi bi-sort-numeric-down"></i>
                        <button type="button" onClick={() => deleteSection(section.id, sectionIndex)} className="ms-2" style={{ border: 0, background: "none", marginBottom: "5px" }}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </>
                  : <>
                    <div className="section-label">{section.label} <small className="ms-1">{section.description}</small></div>
                  </>
              }
              <SectionItemValue
                sectionIndex={sectionIndex}
                sectionValues={section.value}
                inputtype={section.input_type}
                isEdit={(isAdmin || section.permission_edit) == true}
                isAdmin={isAdmin}
                handle={updateVal} />
            </section>
            : <span key={sectionIndex}></span>
        ))
      }
      {
        formData.sections.length === 0 ? <div className="text-center text-muted py-3">Form alanlarını buradan düzenleyebilirsiniz.</div> : <></>
      }
      {
        isAdmin
          ? <>
            <div className="card mt-5">
              <button className="btn py-3" onClick={addSection}>New Section</button>
            </div>
          </>
          : <></>
      }
    </>
  )
}