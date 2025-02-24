import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import PageNameWhite from '../components/PageNameWhite';

const LoginPage = () => {
  return (
    <div className="container">

      <div className='connection-form'>

        <form className="forms">

          <h2 className='log-sub-title'>Connexion</h2>

          <div className="form-group">

            <label>Email</label>
            <input type="email" className="inputs" placeholder="Email" name="email" />

          </div>

          <div className="form-group">

            <div className="password-label-container">

              <label>Mot de passe</label>

              <div className="reveal-password">

                <span>
                  <p href="/#">Afficher</p>
                </span>

                <span>
                  <FontAwesomeIcon icon={faEye} className="icons icons-gray-light" />
                </span>

              </div>

            </div>

            <input type="password" className="inputs" placeholder="Mot de passe" />

            <a href="/#" className="forgot-password">Mot de passe oublié</a>

          </div>

          <button type="submit" className="buttons-primary">Se connecter</button>

        </form>

      </div>

      <div className='app-name-form'>

        <PageNameWhite />

      </div>

    </div>
  );
};

export default LoginPage;