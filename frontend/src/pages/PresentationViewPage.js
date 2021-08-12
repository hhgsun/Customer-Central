import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PresentationModel from '../models/PresentationModel';
import { UPLOAD_PRESENTATION_URL } from '../config';
import PresentationService from '../services/presentationService';
import { useDispatch } from 'react-redux';
import { setCurrentPageTitle } from '../store/utilsSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PresentationViewPage() {
  const { presentId } = useParams()
  const dispatch = useDispatch();

  const [presentationData, setPresentationData] = useState(new PresentationModel());
  const [isLoad, setIsLoad] = useState(false);

  const presentationService = new PresentationService();

  useEffect(() => {
    dispatch(setCurrentPageTitle("Presentation View ..."));

    if (presentId === null) {
      setIsLoad(true);
      return;
    }
    presentationService.getPresentationDetail(presentId).then(res => {
      dispatch(setCurrentPageTitle("Presentation: " + res.title));
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
        :
        <LoadingSpinner />
      }
    </div>
  )
}
