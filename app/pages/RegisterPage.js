import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import PageNameWhite from '../components/PageNameWhite';
import "../../public/styles/register.css";

const RegisterPage = () => {

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate('/str_home');
  };


  return (

    <div className="container">

      <div className='register-form'>

        <form className="forms" onSubmit={onSubmit}>

          <h2 className='log-sub-title'>Inscription</h2>

          <div className="form-group">

            <label>Profil</label>
            <select className="inputs" placeholder="Profil" name="profil">
              <option value="1" defaultChecked>Structure</option>
              <option value="2">Intervenant</option>
              <option value="2">Projet</option>
            </select>

          </div>

          <div className="form-group">

            <label>Email</label>
            <input type="email" className="inputs" placeholder="Email" name="email" />

          </div>

          <div className="form-group">

            <div className="password-label-container">

              <label>Mot de passe</label>

              <div className="reveal-password">

                <span><p>Afficher</p></span>
                <span><FontAwesomeIcon icon={faEye} className="icons icons-gray-light" /></span>

              </div>

            </div>

            <input type="password" className="inputs" placeholder="Mot de passe" />

          </div>


          <div className="form-group">

            <label>Mot de passe</label>
            <input type="password" className="inputs" placeholder="Mot de passe" />

          </div>

          <div className='shuffle-form'>

            <p>Déjà inscrit ? <Link to="/">Se connecter</Link></p>

          </div>

          <button type="submit" className="buttons-primary">S'inscire</button>

        </form>

      </div>

      <div className='app-name-form'>

        <PageNameWhite />

      </div>

    </div>
  );
};

export default RegisterPage;
