import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ClientModel from '../models/ClientModel';
import ClientService from '../services/clientService';
import LogoTBR from "../images/logo-tbr.png";
import CustomerFooter from '../components/CustomerFooter';
import IconFile from '../components/IconFile';
import { UPLOAD_CLIENT_URL } from '../config';

export default function ClientViewPage() {
  const { clientId } = useParams()

  const [clientData, setClientData] = useState(new ClientModel());
  const [isLoad, setIsLoad] = useState(false);

  const clientService = new ClientService();

  useEffect(() => {
    if (clientId === null) {
      setIsLoad(true);
      return;
    }
    clientService.getClientDetail(clientId).then(res => {
      if (res.materials && res.layouts) {
        res.layouts.forEach(layout => {
          // layout.materials = res.materials.filter(m => m.layout_id === layout.id && m.block_id === null && m.group_id === null);
          layout.blocks.forEach(block => {
            block.materials = res.materials.filter(m => m.layout_id === layout.id && m.block_id === block.id && m.group_id === null);
            block.groups.forEach(group => {
              group.materials = res.materials.filter(m => m.layout_id === layout.id && m.block_id === block.id && m.group_id === group.id);
            });
          })
        });
      }
      setClientData(res);
      setIsLoad(true);
    })
  }, []);

  return (
    <div className="client-view">
      {isLoad
        ?
        <>
          <ClientHeader />

          <div className="client-main">

            {
              clientData.layouts.map((layout, layoutIndex) =>
                <section className="client-layout w-100" style={{ backgroundColor: layout.bgColor, color: layout.textColor }} key={layoutIndex}>
                  <div className="container-client">

                    <div className="layout-head mb-5">
                      <h2 dangerouslySetInnerHTML={{ __html: layout.title }}></h2>
                    </div>

                    {
                      layout.blocks.map((block, blockIndex) =>
                        <div key={blockIndex} className="client-block border-radius my-5" style={{ border: `1px solid ${layout.textColor}` }}>

                          {
                            block.type == "files"
                              ? // FILES BLOCK:
                              <>
                                <ul className={`nav justify-content-evenly border-radius ${block.groups.length === 1 ? "nav-one" : ""}`} role="tablist" style={{ backgroundColor: layout.textColor, marginTop: "-2px", marginLeft: "-1px" }}>
                                  {
                                    block.groups.map((group, groupIndex) =>
                                      <li key={groupIndex} className="nav-item" role="presentation">
                                        <a href="#" className={`nav-link ${groupIndex === 0 ? "active" : ""} ${block.groups.length === 1 ? "disabled" : ""}`} aria-selected={`${groupIndex === 0 ? "true" : "false"}`}
                                          id={`${group.id}-tab`} data-bs-target={`#files${group.id}-content`} aria-controls={`${group.id}`} data-bs-toggle="tab" type="button" role="tab"
                                          style={{ color: layout.bgColor }} >
                                          {group.title}
                                        </a>
                                      </li>
                                    )
                                  }
                                </ul>
                                <div className="tab-content px-5 py-4">
                                  {
                                    block.groups.map((group, groupIndex) =>
                                      <div key={groupIndex} className={`tab-pane fade ${groupIndex === 0 ? "show active" : ""}`}
                                        id={`files${group.id}-content`} role="tabpanel" aria-labelledby={`${group.id}-tab`}>

                                        {group.materials.map((material) =>
                                          <div key={material.id} className="material-item d-flex align-items-center py-2 position-relative">
                                            <IconFile name={material.file_val.nativeName} />
                                            {material.label}
                                            <a className="btn-download ms-auto" href={UPLOAD_CLIENT_URL + material.file_val.fileName} target="_blank" rel="noreferrer" download
                                              style={{ color: layout.bgColor, backgroundColor: layout.textColor }}>DOWNLOAD</a>
                                          </div>
                                        )}

                                      </div>
                                    )
                                  }
                                </div>
                                <div className="block-bottom-btns d-flex justify-content-center">
                                  {block.materials.map((material) =>
                                    <a key={material.id} className="btn-download mx-1" href={UPLOAD_CLIENT_URL + material.file_val.fileName} target="_blank" rel="noreferrer" download
                                      style={{ color: layout.bgColor, backgroundColor: layout.textColor }}>{material.label}</a>
                                  )}
                                </div>
                              </>
                              : <></>
                          }
                          {
                            block.type == "colors"
                              ?
                              <>
                                <ul className="nav nav-one justify-content-evenly border-radius pe-4 position-relative" role="tablist"
                                  style={{ backgroundColor: layout.textColor, marginTop: "-2px", marginLeft: "-1px", marginBottom: "-15px" }}>
                                  <li className="nav-item me-auto">
                                    <a href="#" className="nav-link disabled" style={{ color: layout.bgColor }} >
                                      {block.title}
                                    </a>
                                  </li>
                                  {block.materials.map((material, materialIndex) =>
                                    <li key={material.id} className="nav-item" role="presentation">
                                      <a href="#" className={`nav-link nav-link-color ${materialIndex === 0 ? "active" : ""}`} aria-selected={`${materialIndex === 0 ? "true" : "false"}`}
                                        id={`${material.id}-tab`} data-bs-target={`#color${material.id}-content`} aria-controls={`${material.id}`} data-bs-toggle="tab" type="button" role="tab"
                                        style={{ color: layout.bgColor, backgroundColor: material.color.hex }} >
                                      </a>
                                    </li>
                                  )}
                                </ul>
                                <div className="tab-content">
                                  {block.materials.map((material, materialIndex) =>
                                    <div key={material.id} className={`tab-pane border-radius pt-5 pb-4 px-5 fade ${materialIndex === 0 ? "show active" : ""}`}
                                      id={`color${material.id}-content`} role="tabpanel" aria-labelledby={`${material.id}-tab`}
                                      style={{ backgroundColor: material.color.hex }}>
                                      <div className="mb-2">
                                        <b style={{ minWidth: "70px", display: "inline-block" }}>CMYK:</b>
                                        <span style={{ userSelect: "all" }}>{material.color.cmyk}</span>
                                      </div>
                                      <div className="mb-2">
                                        <b style={{ minWidth: "70px", display: "inline-block" }}>RGB:</b>
                                        <span style={{ userSelect: "all" }}>{material.color.rgb}</span>
                                      </div>
                                      <div className="mb-2">
                                        <b style={{ minWidth: "70px", display: "inline-block" }}>HEX:</b>
                                        <span style={{ userSelect: "all" }}>{material.color.hex}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                              : <></>
                          }
                        </div>
                      )
                    }

                  </div>
                </section>
              )
            }

          </div>

          <CustomerFooter />
        </>
        : "Bekleyiniz"
      }
    </div>
  )
}

function ClientHeader() {
  return (
    <div className="client-header" style={{ color: "var(--primary-bg)" }}>
      <div className="container-client d-flex flex-column align-items-center py-5">
        <img width="200" height="37" src={LogoTBR} />
        <i>Client Central</i>
      </div>
    </div>
  )
}