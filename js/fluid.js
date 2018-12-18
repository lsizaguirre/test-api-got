// Código que simula el comportamiento responsivo de la ventana modal.

$(window).resize(function () {
    fluidDialog();
});


$(document).on("dialogopen", ".ui-dialog", function (event, ui) {
    fluidDialog();
});

function fluidDialog() {
    var $visible = $(".ui-dialog:visible");
    $visible.each(function () {
        var $this = $(this);
        var dialog = $this.find(".ui-dialog-content").data("ui-dialog");
        if (dialog.options.fluid) {
            var wWidth = $(window).width();
            if (wWidth < (parseInt(dialog.options.maxWidth) + 50)) {
                $this.css("max-width", "90%");
            } else {
                $this.css("max-width", dialog.options.maxWidth + "px");
            }
            dialog.option("position", dialog.options.position);
        }
    });

}