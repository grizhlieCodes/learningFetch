function removeModalElementsAfterFade() {
    const removables = [...document.querySelectorAll('.removeElement')]
    const removeElsPromise = new Promise((resolve, reject) => {
      removables.forEach(removable => {
        removable.classList.add('fade-out')
      })
    })
    removeElsPromise
      .then(setTimeout(() => {
        removables.forEach(removable => {
          document.body.removeChild(removable)
        })
      }, 1000))
      .catch(err => console.log(err))
  }
  
export function closeModal(event) {
    if (event.key && event.key === 'Escape') {
      removeModalElementsAfterFade();
      return
    }
    if (event.target.classList.contains('backdrop')) {
      removeModalElementsAfterFade();
      return
    }
    if (event.target.classList.contains('close-button')) {
      removeModalElementsAfterFade();
      return
    }
  }