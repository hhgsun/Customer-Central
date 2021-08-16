import { nanoid } from '@reduxjs/toolkit';
import React from 'react'
import MaterialModel from '../models/MaterialModel';
import { UPLOAD_STORAGE_URL } from '../config';
import IconFile from './IconFile';

export default function MaterialList({ storageData, setStorageData }) {

  const addLayout = () => {
    setStorageData(prevState => ({
      ...storageData,
      layouts: [
        ...storageData.layouts,
        { id: nanoid(6), title: "", bgColor: "#088bcb", textColor: "#ffffff", blocks: [] }
      ]
    }));
  }

  const addBlock = (e, layoutIndex, blockType = "files") => {
    const layouts = [
      ...storageData.layouts.slice(0, layoutIndex),
      {
        ...storageData.layouts[layoutIndex],
        blocks: [
          ...storageData.layouts[layoutIndex].blocks,
          { id: nanoid(6), title: "", type: blockType, groups: [] }
        ]
      },
      ...storageData.layouts.slice(layoutIndex + 1)
    ]
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts
    }));
  }

  const addGroup = (e, layoutIndex, blockIndex) => {
    const blocks = [
      ...storageData.layouts[layoutIndex].blocks.slice(0, blockIndex),
      {
        ...storageData.layouts[layoutIndex].blocks[blockIndex],
        groups: [
          ...storageData.layouts[layoutIndex].blocks[blockIndex].groups,
          { id: nanoid(6), title: "" }
        ]
      },
      ...storageData.layouts[layoutIndex].blocks.slice(blockIndex + 1),
    ];
    const layouts = [
      ...storageData.layouts.slice(0, layoutIndex),
      {
        ...storageData.layouts[layoutIndex],
        blocks: blocks
      },
      ...storageData.layouts.slice(layoutIndex + 1)
    ]
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts
    }));
  }

  const deleteLayout = (e, layoutId) => {
    var c = window.confirm("Alanı silmek üzeresiniz.")
    if (!c) return;
    const layouts = storageData.layouts.filter(l => l.id !== layoutId);
    let filtered = [];
    let deletedIds = [];
    storageData.materials.forEach(m => {
      var d = (m.layout_id === layoutId);
      if (d) {
        if (m.id != null) {
          deletedIds.push(m.id);
        }
      } else {
        filtered.push(m);
      }
    });
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts,
      materials: filtered,
      deletedMaterialIds: [...storageData.deletedMaterialIds, ...deletedIds]
    }))
  }

  const deleteBlock = (e, layoutId, blockId) => {
    var c = window.confirm("Bloğu silmek üzeresiniz.")
    if (!c) return;
    const layouts = [
      ...storageData.layouts.filter(l => l.id !== layoutId),
      {
        ...storageData.layouts.filter(l => l.id === layoutId)[0],
        blocks: [
          ...storageData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id !== blockId),
        ]
      },
    ]
    let filtered = [];
    let deletedIds = [];
    storageData.materials.forEach(m => {
      var d = (m.layout_id === layoutId && m.block_id === blockId);
      if (d) {
        if (m.id != null) {
          deletedIds.push(m.id);
        }
      } else {
        filtered.push(m);
      }
    });
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts,
      materials: filtered,
      deletedMaterialIds: [...storageData.deletedMaterialIds, ...deletedIds]
    }))
  }

  const deleteGroup = (e, layoutId, blockId, groupId) => {
    var c = window.confirm("Grubu silmeniz durumunda gruba ait materyaller de silinecektir.")
    if (!c) return;
    const layouts = [
      ...storageData.layouts.filter(l => l.id !== layoutId),
      {
        ...storageData.layouts.filter(l => l.id === layoutId)[0],
        blocks: [
          ...storageData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id !== blockId),
          {
            ...storageData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0],
            groups: [
              ...storageData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0].groups.filter(g => g.id !== groupId),
            ]
          },
        ]
      },
    ]
    let filtered = [];
    let deletedIds = [];
    storageData.materials.forEach(m => {
      var d = (m.layout_id === layoutId && m.block_id === blockId && m.group_id === groupId);
      if (d) {
        if (m.id != null) {
          deletedIds.push(m.id);
        }
      } else {
        filtered.push(m);
      }
    });
    setStorageData(prevState => {
      return {
        ...storageData,
        layouts: layouts,
        materials: filtered,
        deletedMaterialIds: [...storageData.deletedMaterialIds, ...deletedIds]
      }
    });
  }

  /* */
  const handleLayoutProp = (e, layoutIndex) => {
    let layoutData = [...storageData.layouts];
    layoutData[layoutIndex] = {
      ...layoutData[layoutIndex],
      [e.target.name]: e.target.value
    }
    setStorageData(prevState => ({
      ...storageData,
      layouts: layoutData
    }))
  }

  const handleBlockProp = (e, layoutId, blockId) => {
    const layouts = [...storageData.layouts];
    layouts.map(l => {
      if (l.id === layoutId) {
        l.blocks.map(b => {
          if (b.id === blockId) {
            b.title = e.target.value
          }
        })
      }
    })
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts
    }))
  }

  const handleGroupProp = (e, layoutId, blockId, groupId) => {
    const layouts = [...storageData.layouts];
    layouts.map(l => {
      if (l.id === layoutId) {
        l.blocks.map(b => {
          if (b.id === blockId) {
            b.groups.map(g => {
              if (g.id === groupId) {
                g.title = e.target.value;
              }
            })
          }
        })
      }
    })
    setStorageData(prevState => ({
      ...storageData,
      layouts: layouts
    }))
  }

  /* */

  const addMaterial = (e, layoutId, blockId, groupId) => {
    setStorageData(prevState => ({
      ...storageData,
      materials: [
        ...storageData.materials,
        Object.assign({}, new MaterialModel({ layout_id: layoutId, block_id: blockId, group_id: groupId }))
      ]
    }));
  }

  const deleteMaterial = (e, index) => {
    var c = window.confirm("Silmek istediğinize emin misiniz?")
    if (!c) return;
    if (storageData.materials[index]) {
      let filtered = storageData.materials.filter((s, i) => i !== index);
      let deletedIds = [];
      if (storageData.materials[index].id !== null) {
        deletedIds.push(storageData.materials[index].id)
      }
      setStorageData(prevState => ({
        ...storageData,
        materials: filtered,
        deletedMaterialIds: [...storageData.deletedMaterialIds, ...deletedIds]
      }));
    }
  }

  const handleMaterialColor = (e, materialIndex) => {
    let materials = [...storageData.materials];
    materials[materialIndex] = {
      ...materials[materialIndex],
      color: {
        ...materials[materialIndex].color,
        [e.target.name]: e.target.value
      }
    }
    setStorageData(prevState => ({
      ...storageData,
      materials: materials
    }))
  }

  const handleMaterialLabel = (e, materialIndex) => {
    let materials = [...storageData.materials];
    materials[materialIndex] = {
      ...materials[materialIndex],
      label: e.target.value
    }
    setStorageData(prevState => ({
      ...storageData,
      materials: materials
    }))
  }

  const handleMaterialOrder = (e, materialIndex) => {
    let materials = [...storageData.materials];
    materials[materialIndex] = {
      ...materials[materialIndex],
      order_number: e.target.value
    }
    setStorageData(prevState => ({
      ...storageData,
      materials: materials
    }))
  }

  const handleMaterialFile = (event, material, materialIndex) => {
    const materials = [...storageData.materials];
    [...event.target.files].forEach((file, fileIndex) => {
      if (file) {
        const saveObj = {
          file: file,
          fileName: Date.now().toString() + "__" + file.name,
          nativeName: file.name,
          newAddedUrl: URL.createObjectURL(file),
        };
        if (fileIndex === 0) {
          materials[materialIndex] = {
            ...materials[materialIndex],
            file_val: saveObj,
            label: material.label === "" ? file.name.split('.').slice(0, -1).join('.') : material.label
          }
        } else {
          materials.push(
            Object.assign({}, new MaterialModel({
              file_val: saveObj,
              layout_id: material.layout_id,
              block_id: material.block_id,
              group_id: material.group_id,
              label: material.label === "" ? file.name : material.label
            }))
          );
        }
      }
    });
    setStorageData(prevState => ({
      ...storageData,
      materials: materials
    }))
  }

  return (
    <div>
      {
        storageData.layouts.map((layout, layoutIndex) =>
          <section key={layoutIndex} className="storage-layout card py-5 my-5 border-bottom" style={{ backgroundColor: layout.bgColor, color: layout.textColor }}>
            <span className="section-name-fixed position-absolute card bg-transparent">LAYOUT</span>

            <div className="container-storage w-100 m-auto">
              <div className="storage-layout-control d-flex flex-column mb-2">
                <i className={`delete-icon bi bi-trash cursor ms-auto ${layout.blocks.length > 0 ? "invisible" : ""}`} onClick={(e) => deleteLayout(e, layout.id)} title="Delete Layout"></i>
                <div className="d-flex flex-column">
                  <h2 className="h4" dangerouslySetInnerHTML={{ __html: layout.title }}></h2>
                  <input name="title" className="form-control form-control-sm" value={layout.title} onChange={(e) => handleLayoutProp(e, layoutIndex)} placeholder="Layout Title" />
                  <div className="d-flex ms-auto mt-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-paint-bucket"></i>
                      <input type="color" name="bgColor" value={layout.bgColor} onChange={(e) => handleLayoutProp(e, layoutIndex)} className="p-0 border-0" />
                    </div>
                    <div className="d-flex align-items-center ms-2">
                      <i className="bi bi-fonts"></i>
                      <input type="color" name="textColor" value={layout.textColor} onChange={(e) => handleLayoutProp(e, layoutIndex)} className="p-0 border-0" />
                    </div>
                  </div>
                </div>
              </div>

              {layout.blocks.map((block, blockIndex) => <div key={blockIndex} className="storage-block card border px-2 my-5 bg-transparent align-items-start">
                <span className="section-name-fixed position-absolute card bg-transparent text-uppercase">BLOCK {block.type}</span>

                <div className="storage-block-control input-group input-group-sm d-flex w-100 my-3 pt-2">
                  {
                    block.type === "colors" ?
                      <input className="form-control fw-bold" style={{ color: layout.bgColor }} placeholder="Block Name" value={block.title} onChange={(e) => handleBlockProp(e, layout.id, block.id)} />
                      : <></>
                  }
                  <i className={`input-group-text delete-icon bi bi-trash cursor ms-auto ${block.groups.length > 0 ? "invisible" : ""}`} onClick={(e) => deleteBlock(e, layout.id, block.id)} title="Delete Block"></i>
                </div>

                {block.groups.map((group, groupIndex) => <div key={groupIndex} className="storage-group card bg-transparent align-items-start p-2 mb-2 w-100" style={{ minHeight: "100px" }}>
                  <div className="storage-group-control input-group input-group-sm d-flex w-100">
                    <input className="form-control fw-bold" style={{ color: layout.bgColor }} placeholder="Group Name" value={group.title} onChange={(e) => handleGroupProp(e, layout.id, block.id, group.id)} />
                    <i className="input-group-text delete-icon bi bi-trash invisible cursor" onClick={(e) => deleteGroup(e, layout.id, block.id, group.id)} title="Delete Group"></i>
                  </div>

                  {/* GROUP MATERIALS */}
                  {storageData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                    {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == group.id)
                      ?
                      <div className="material-item d-flex align-items-center border-bottom border-secondary py-3 position-relative">
                        <IconFile name={material.file_val.nativeName} />
                        <input className="form-control w-auto bg-transparent me-2 px-1" value={material.label} onChange={(e) => handleMaterialLabel(e, materialIndex)} placeholder="Label" />
                        <label className="btn btn-light overflow-auto" style={{ maxWidth: "330px" }}>
                          {material.file_val.nativeName
                            ? <span className="d-flex text-start" style={{ whiteSpace: "nowrap" }}><i className="bi bi-file-earmark-check me-2"></i>{material.file_val.nativeName}</span>
                            : <i className="bi bi-file-earmark-plus"></i>
                          }
                          <input type="file" onChange={(e) => handleMaterialFile(e, material, materialIndex)} multiple={true} hidden />
                        </label>
                        {material.file_val.newAddedUrl === null
                          ? <a className="btn btn-sm ms-1 me-2 px-0" href={UPLOAD_STORAGE_URL + material.file_val.fileName} target="_blank" rel="noreferrer" style={{ color: layout.textColor }}><i className="bi bi-box-arrow-up-right"></i></a>
                          : <></>
                        }
                        <input name="order_number" type="number" value={material.order_number} onChange={(e) => handleMaterialOrder(e, materialIndex)} class="form-control px-0 ms-1 bg-transparent text-end" style={{ maxWidth: "40px" }} placeholder="Sıra" />
                        <i className="delete-icon bi bi-trash invisible cursor position-absolute" onClick={(e) => deleteMaterial(e, materialIndex)} title="Delete Material"></i>
                      </div>
                      : <></>}
                  </div>)}
                  <button onClick={(e) => addMaterial(e, layout.id, block.id, group.id)} className="btn btn-sm btn-dark mt-3 mx-auto">
                    New Material
                  </button>

                </div>)}

                {block.type === "files"
                  ?
                  <div className="d-flex my-3">
                    <button className="btn btn-sm btn-secondary" onClick={(e) => addGroup(e, layoutIndex, blockIndex)}>New Group</button>
                    <button className="btn btn-sm btn-outline-secondary ms-2" style={{ color: layout.textColor }} onClick={(e) => addMaterial(e, layout.id, block.id, null)}>Add Button</button>
                  </div>
                  : <></>
                }

                {/* BLOCK BUTTONS */}
                {block.type === "files"
                  ?
                  <div className="border-top w-100">
                    {
                      storageData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                        {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == null)
                          ?
                          <div className="material-item d-flex align-items-center justify-content-center border-top border-secondary py-3 position-relative">
                            <input className="form-control w-auto bg-transparent me-2" value={material.label} onChange={(e) => handleMaterialLabel(e, materialIndex)} placeholder="Button Label" />
                            <label className="btn btn-light overflow-auto" style={{ maxWidth: "330px" }}>
                              {material.file_val.nativeName
                                ? <span className="d-flex text-start" style={{ whiteSpace: "nowrap" }}><i className="bi bi-file-earmark-check me-2"></i>{material.file_val.nativeName}</span>
                                : <i className="bi bi-file-earmark-plus"></i>
                              }
                              <input type="file" onChange={(e) => handleMaterialFile(e, material, materialIndex)} multiple={true} hidden />
                            </label>
                            {material.file_val.newAddedUrl === null
                              ? <a className="btn btn-sm ms-2" href={UPLOAD_STORAGE_URL + material.file_val.fileName} target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right"></i></a>
                              : <></>
                            }
                            <input name="order_number" type="number" value={material.order_number} onChange={(e) => handleMaterialOrder(e, materialIndex)} class="form-control px-0 ms-1 bg-transparent text-end" style={{ maxWidth: "40px" }} placeholder="Sıra" />
                            <i className="delete-icon bi bi-trash invisible cursor position-absolute" onClick={(e) => deleteMaterial(e, materialIndex)}></i>
                          </div>
                          : <></>}
                      </div>)
                    }
                  </div>
                  : <></>
                }

                {/* BLOCK COLORS */}
                {block.type === "colors"
                  ?
                  <div className="w-100">
                    {storageData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                      {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == null)
                        ?
                        <div className="material-item py-2 position-relative">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">CMYK:</span>
                            <input name="cmyk" className="form-control bg-transparent" value={material.color.cmyk} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <span className="input-group-text">RGB:</span>
                            <input name="rgb" className="form-control bg-transparent" value={material.color.rgb} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <span className="input-group-text">HEX:</span>
                            <input name="hex" className="form-control bg-transparent" value={material.color.hex} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <input name="order_number" type="number" value={material.order_number} onChange={(e) => handleMaterialOrder(e, materialIndex)} class="form-control px-0 bg-transparent text-end" style={{ maxWidth: "40px" }} placeholder="Sıra" />
                            <i className="input-group-text delete-icon bi bi-trash invisible cursor" onClick={(e) => deleteMaterial(e, materialIndex)}></i>
                          </div>
                        </div>
                        : <></>}
                    </div>)}
                    <button className="btn btn-sm btn-outline-secondary mx-auto my-2" onClick={(e) => addMaterial(e, layout.id, block.id, null)} style={{ color: layout.textColor }}>
                      Add Color
                    </button>
                  </div>
                  : <></>
                }

              </div>)}


              <div className="d-flex my-2">
                <button onClick={(e) => addBlock(e, layoutIndex)} className="btn btn-sm btn-light">New Files Block</button>
                <button onClick={(e) => addBlock(e, layoutIndex, "colors")} className="btn btn-sm btn-light ms-2">New Colors Block</button>
              </div>
            </div>
          </section>
        )
      }
      <hr />
      <button onClick={addLayout} className="btn btn-outline-dark mb-5">New Layout</button>
    </div>
  )
}
