document.addEventListener("DOMContentLoaded", function () {
  // Elementos da DOM
  const backBtn = document.getElementById("back-btn");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const editProfileForm = document.getElementById("edit-profile-form");
  const usernameInput = document.getElementById("name");
  const optionsContainer = document.querySelector(".options-container");
  const userNameElement = document.querySelector(".user-name");
  const userIdElement = document.querySelector(".user-id");
  const cameraIcon = document.querySelector(".camera-icon");
  const emailInput = document.getElementById("email");
  const updateButton = document.querySelector(".update-button");

  // Get user data from token
  let token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/src/views/login/login.html";
    return;
  }
  document.body.style.display = "block";
  // Parse JWT token
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Load user data from database
  async function loadUserData() {
    try {
      // First try to get data from token
      const userData = parseJwt(token);
      if (!userData) {
        console.error("Token inválido ou expirado");
        window.location.href = "/src/views/login/login.html";
        return;
      }

      // Populate with token data initially
      if (userNameElement)
        userNameElement.textContent = userData.nome || "Usuário";
      if (userIdElement)
        userIdElement.textContent = `ID: ${userData.id || "N/A"}`;
      if (usernameInput) usernameInput.value = userData.nome || "";
      if (emailInput) emailInput.value = userData.email || "";
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  // Load user data when page loads
  loadUserData();

  // Event Listeners
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      // Usa o gerenciador de transições para voltar de forma fluida
      if (window.pageTransitions) {
        window.pageTransitions.goBack();
      } else {
        window.history.back();
      }
    });
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      // Toggle form visibility
      editProfileForm.classList.remove("hidden");
      optionsContainer.classList.add("hidden");
    });
  }

  if (cameraIcon) {
    cameraIcon.addEventListener("click", function () {
      showToast(
        "A função de alterar foto de perfil não está disponível.",
        "info"
      );
    });
  }

  // Toast notification
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast-notification animate-fade-in ${type === "error" ? "bg-red-600" : ""}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  updateButton.addEventListener("click", async function (e) {
    e.preventDefault();
    showToast("Atualizando perfil...");

    const userData = parseJwt(token);
    if (!userData || !userData.id) {
      showToast("Usuário inválido ou token expirado.");
      return;
    }

    const updatedFields = {
      nome: usernameInput.value,
      email: emailInput.value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/usuarios/${userData.id}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil.");
      }

      data = await response.json();

      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }

      token = sessionStorage.getItem("token");
      loadUserData();
      showToast("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      showToast("Não foi possível atualizar o perfil.");
    }
  });
});
