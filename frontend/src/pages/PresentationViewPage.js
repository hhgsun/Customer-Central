import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PresentationModel from '../models/PresentationModel';
import { UPLOAD_PRESENTATION_URL } from '../config';
import PresentationService from '../services/presentationService';

export default function PresentationViewPage() {
  const { presentId } = useParams()

  const [presentationData, setPresentationData] = useState(new PresentationModel());
  const [isLoad, setIsLoad] = useState(false);

  const presentationService = new PresentationService();

  useEffect(() => {
    if (presentId === null) {
      setIsLoad(true);
      return;
    }
    presentationService.getPresentationDetail(presentId).then(res => {
      setPresentationData(res);
      setIsLoad(true);
    })
  }, []);


  return (
    <div>
      {isLoad
        ? presentationData.images.map((image, imageIndex) => <section key={imageIndex}>
          <img src={UPLOAD_PRESENTATION_URL + image.fileName} alt={presentationData.title + " " + imageIndex} className="w-100" />
        </section>)
        : <div className="p-5 text-center my-5">Yükleniyor...</div>}
    </div>
  )
}
