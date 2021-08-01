import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from 'react'
import MaterialModel from '../models/MaterialModel';

export default function MaterialList({ clientData, setClientData }) {

  const addLayout = () => {
    setClientData(prevState => ({
      ...clientData,
      layouts: [
        ...clientData.layouts,
        {
          id: nanoid(6),
          title: "",
          bgColor: "#088bcb",
          textColor: "#ffffff",
          blocks: [],
        }
      ]
    }));
  }

  const addBlock = (e, layoutIndex, blockType = "files") => {
    const layouts = [
      ...clientData.layouts.slice(0, layoutIndex),
      {
        ...clientData.layouts[layoutIndex],
        blocks: [
          ...clientData.layouts[layoutIndex].blocks,
          { id: nanoid(6), title: "", groups: [], type: blockType }
        ]
      },
      ...clientData.layouts.slice(layoutIndex + 1)
    ]
    setClientData(prevState => ({
      ...clientData,
      layouts: layouts
    }));
  }

  const addGroup = (e, layoutIndex, blockIndex) => {
    const blocks = [
      ...clientData.layouts[layoutIndex].blocks.slice(0, blockIndex),
      {
        ...clientData.layouts[layoutIndex].blocks[blockIndex],
        groups: [
          ...clientData.layouts[layoutIndex].blocks[blockIndex].groups,
          { id: nanoid(6), title: "" }
        ]
      },
      ...clientData.layouts[layoutIndex].blocks.slice(blockIndex + 1),
    ];
    const layouts = [
      ...clientData.layouts.slice(0, layoutIndex),
      {
        ...clientData.layouts[layoutIndex],
        blocks: blocks
      },
      ...clientData.layouts.slice(layoutIndex + 1)
    ]
    setClientData(prevState => ({
      ...clientData,
      layouts: layouts
    }));
  }

  const deleteBlock = (e, layoutId, blockId) => {
    var c = window.confirm("Bloğu silmek üzeresiniz.")
    if (!c) return;
    const layouts = [
      ...clientData.layouts.filter(l => l.id !== layoutId),
      {
        ...clientData.layouts.filter(l => l.id === layoutId)[0],
        blocks: [
          ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id !== blockId),
        ]
      },
    ]
    setClientData(prevState => ({
      ...clientData,
      layouts: layouts
    }))
  }

  const deleteLayout = (e, layoutId) => {
    var c = window.confirm("Alanı silmek üzeresiniz.")
    if (!c) return;
    const layouts = clientData.layouts.filter(l => l.id !== layoutId)
    setClientData(prevState => ({
      ...clientData,
      layouts: layouts
    }))
  }

  const deleteGroup = (e, layoutId, blockId, groupId) => {
    var c = window.confirm("Grubu silmeniz durumunda gruba ait materyaller de silinecektir.")
    if (!c) return;
    const layouts = [
      ...clientData.layouts.filter(l => l.id !== layoutId),
      {
        ...clientData.layouts.filter(l => l.id === layoutId)[0],
        blocks: [
          ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id !== blockId),
          {
            ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0],
            groups: [
              ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0].groups.filter(g => g.id !== groupId),
            ]
          },
        ]
      },
    ]
    const { deletedMaterialIds, materials } = deleteGroupMaterials(layoutId, blockId, groupId);

    setClientData(prevState => {
      return {
        ...clientData,
        layouts: layouts,
        materials: materials,
        deletedMaterialIds: deletedMaterialIds
      }
    });
  }

  const deleteGroupMaterials = (layoutId, blockId, groupId) => {
    console.log(clientData.materials);
    let filtered = [];
    let deletedIds = [];
    clientData.materials.forEach(m => {
      var d = (m.layout_id === layoutId && m.block_id === blockId && m.group_id === groupId);
      if (d) {
        if (m.id != null) {
          deletedIds.push(m.id);
        }
      } else {
        filtered.push(m);
      }
    });
    return {
      materials: filtered,
      deletedMaterialIds: [...clientData.deletedMaterialIds, ...deletedIds]
    }
  }

  /* */
  const handleLayoutProp = (e, layoutIndex) => {
    let layoutData = [...clientData.layouts];
    layoutData[layoutIndex] = {
      ...layoutData[layoutIndex],
      [e.target.name]: e.target.value
    }
    setClientData(prevState => ({
      ...clientData,
      layouts: layoutData
    }))
  }

  const handleGroupProp = (e, layoutId, blockId, groupId) => {
    const groups = [
      ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0].groups
    ].map((g, i) => {
      if (g.id === groupId) {
        g.title = e.target.value;
      }
      return g;
    })
    const layouts = [
      ...clientData.layouts.filter(l => l.id !== layoutId),
      {
        ...clientData.layouts.filter(l => l.id === layoutId)[0],
        blocks: [
          ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id !== blockId),
          {
            ...clientData.layouts.filter(l => l.id === layoutId)[0].blocks.filter(b => b.id === blockId)[0],
            groups: groups
          },
        ]
      },
    ]
    setClientData(prevState => ({
      ...clientData,
      layouts: layouts
    }))
  }

  /* */

  const addMaterial = (e, layoutId, blockId, groupId) => {
    setClientData(prevState => ({
      ...clientData,
      materials: [
        ...clientData.materials,
        Object.assign({}, new MaterialModel({ layout_id: layoutId, block_id: blockId, group_id: groupId }))
      ]
    }));
  }

  const deleteMaterial = (e, index) => {
    var c = window.confirm("Silmek istediğinize emin misiniz?")
    if (!c) return;
    if (clientData.materials[index]) {
      let filtered = clientData.materials.filter((s, i) => i !== index);
      let deletedIds = [];
      if (clientData.materials[index].id !== null) {
        deletedIds.push(clientData.materials[index].id)
      }
      setClientData(prevState => ({
        ...clientData,
        materials: filtered,
        deletedMaterialIds: [...clientData.deletedMaterialIds, ...deletedIds]
      }));
    }
  }

  const handleMaterialColor = (e, materialIndex) => {
    let materials = [...clientData.materials];
    materials[materialIndex] = {
      ...materials[materialIndex],
      color: {
        ...materials[materialIndex].color,
        [e.target.name]: e.target.value
      }
    }
    setClientData(prevState => ({
      ...clientData,
      materials: materials
    }))
  }

  const handleMaterialImage = (event, material, materialIndex) => {
    const materials = [...clientData.materials];
    [...event.target.files].forEach((file) => {
      if (file) {
        const saveObj = {
          file: file,
          fileName: Date.now().toString() + "__" + file.name,
          newAddedUrl: URL.createObjectURL(file),
        };
        if (event.target.files.length > 1) {
          materials.push(
            Object.assign({}, new MaterialModel({
              file_val: saveObj,
              layout_id: material.layout_id,
              block_id: material.block_id,
              group_id: material.group_id,
              label: material.label === "" ? file.name : material.label
            }))
          );
        } else {
          materials[materialIndex] = {
            ...materials[materialIndex],
            file_val: saveObj,
            label: material.label === "" ? file.name : material.label
          }
        }
      }
    });
    setClientData(prevState => ({
      ...clientData,
      materials: materials
    }))
  }

  return (
    <div>
      {JSON.stringify(clientData)}
      {
        clientData.layouts.map((layout, layoutIndex) =>
          <section key={layoutIndex} className="client-layout card py-5 my-5 border-bottom" style={{ backgroundColor: layout.bgColor, color: layout.textColor }}>
            <span className="section-name-fixed position-absolute card bg-transparent">LAYOUT</span>

            <div className="container-client w-100 m-auto">
              <div className="client-layout-control d-flex flex-column mb-2">
                <i className={`delete-icon bi bi-trash cursor ms-auto ${layout.blocks.length > 0 ? "invisible" : ""}`} onClick={(e) => deleteLayout(e, layout.id)} title="Delete Layout"></i>
                <div className="d-flex flex-column">
                  <h2 className="h4" dangerouslySetInnerHTML={{ __html: layout.title }}></h2>
                  <input name="title" className="form-control" value={layout.title} onChange={(e) => handleLayoutProp(e, layoutIndex)} placeholder="Layout Title" />
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

              {layout.blocks.map((block, blockIndex) => <div key={blockIndex} className="client-block card border px-2 my-5 bg-transparent align-items-start">
                <span className="section-name-fixed position-absolute card bg-transparent text-uppercase">BLOCK {block.type}</span>

                <div className="client-block-control d-flex w-100 mb-3">
                  <i className={`delete-icon bi bi-trash cursor ms-auto ${block.groups.length > 0 ? "invisible" : ""}`} onClick={(e) => deleteBlock(e, layout.id, block.id)} title="Delete Block"></i>
                </div>

                {block.groups.map((group, groupIndex) => <div key={groupIndex} className="client-group card bg-transparent align-items-start p-2 mb-2 w-100" style={{ minHeight: "100px" }}>
                  <div className="client-group-control d-flex w-100">
                    <input className="form-control form-control-sm" placeholder="Group Name" value={group.title} onChange={(e) => handleGroupProp(e, layout.id, block.id, group.id)} />
                    <i className="delete-icon bi bi-trash ms-2 invisible cursor" onClick={(e) => deleteGroup(e, layout.id, block.id, group.id)} title="Delete Group"></i>
                  </div>

                  {clientData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                    {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == group.id)
                      ?
                      <div className="material-item border-bottom border-secondary py-2 position-relative">
                        {material.label}
                        <input type="file" onChange={(e) => handleMaterialImage(e, material, materialIndex)} multiple={true} />
                        <i className="delete-icon bi bi-trash invisible cursor position-absolute" onClick={(e) => deleteMaterial(e, materialIndex)}></i>
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
                    <button className="btn btn-sm ms-2" onClick={(e) => addMaterial(e, layout.id, block.id, null)}>Add Block Button</button>
                  </div>
                  : <></>
                }
                {block.type === "files"
                  ?
                  clientData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                    {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == null)
                      ? <div className="material-item border-bottom border-secondary py-2 position-relative">
                        {JSON.stringify(material.layout_id)}
                        {JSON.stringify(material.block_id)}
                        {JSON.stringify(material.group_id)}
                        <i className="delete-icon bi bi-trash invisible cursor position-absolute" onClick={(e) => deleteMaterial(e, materialIndex)}></i>
                      </div>
                      : <></>}
                  </div>)
                  : <></>
                }

                {block.type === "colors"
                  ?
                  <div className="w-100">
                    {clientData.materials.map((material, materialIndex) => <div key={materialIndex} className="w-100">
                      {(material.layout_id == layout.id && material.block_id == block.id && material.group_id == null)
                        ?
                        <div className="material-item py-2 position-relative">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">CMYK:</span>
                            <input name="cmyk" className="form-control" value={material.color.cmyk} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <span className="input-group-text">RGB:</span>
                            <input name="rgb" className="form-control" value={material.color.rgb} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <span className="input-group-text">HEX:</span>
                            <input name="hex" className="form-control" value={material.color.hex} onChange={(e) => handleMaterialColor(e, materialIndex)} />
                            <i className="delete-icon bi bi-trash invisible cursor ms-2" onClick={(e) => deleteMaterial(e, materialIndex)}></i>
                          </div>
                        </div>
                        : <></>}
                    </div>)}
                    <button className="btn btn-sm mx-auto my-2" onClick={(e) => addMaterial(e, layout.id, block.id, null)}>Add Color</button>
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
