import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js"; // Assurez-vous d'avoir créé ce modèle

// Définition de la stratégie locale pour l'authentification par email/mot de passe
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Champ utilisé pour l'identifiant (ici email)
      passwordField: "password", // Champ utilisé pour le mot de passe
    },
    async (email, password, done) => {
      try {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe
        const isMatch = await user.validPassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Mot de passe incorrect" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisation de l'utilisateur à partir de la session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
