class LabelController
{
  constructor(graph)
  {
    this.graph = graph;

    this.labelEditor = document.getElementById("label-editor");
    this.labelEditorInput = document.getElementById("label-editor-input");
    this.labelEditorInput.addEventListener('keyup', (e) => {
      if (e.keyCode == 13)
      {
        this.closeLabelEditor(true);
      }
      else if (e.keyCode == 27)
      {
        this.closeLabelEditor(false);
      }
    });
    this.labelEditorInput.addEventListener('blur', (e) => {
      this.closeLabelEditor(false);
    })
    this.labelEditorSource = null;
  }

  openLabelEditor(source)
  {
    if (this.labelEditorSource != source)
    {
      this.labelEditor.style.left = (source.x - this.labelEditor.offsetWidth / 2) + 'px';
      this.labelEditor.style.top = (source.y - this.labelEditor.offsetHeight / 2) + 'px';
      this.labelEditorInput.value = source.label;

      this.labelEditor.style.visibility = "visible";
      this.labelEditorSource = source;
      this.labelEditorInput.focus();
      this.labelEditorInput.select();
      return true;
    }
    return false;
  }

  closeLabelEditor(shouldSave)
  {
    if (this.labelEditorSource != null)
    {
      if (shouldSave)
      {
        this.labelEditorSource.label = this.labelEditorInput.value;
      }

      this.labelEditor.style.visibility = "hidden";
      this.labelEditorSource = null;
      return true;
    }
    return false;
  }
}

export default LabelController;
