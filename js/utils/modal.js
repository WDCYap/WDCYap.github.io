export function createResumeModal() {
  if (document.getElementById("resumeModal")) return;

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "resumeModal";
  modal.tabIndex = -1;

  modal.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Resume</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <iframe id="resume-preview" width="100%" height="600px"></iframe>
        </div>
        <div class="modal-footer">
          <a id="resume-download" href="#" class="btn btn-primary" download>
            <i class="fas fa-download me-2"></i>Download PDF
          </a>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}
