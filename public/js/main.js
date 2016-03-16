$(function () {
	$("#add_docker").click(function () {
		$.post('/docker', {
			href: $("#docker").val()
		})
	})

	$.getJSON("/dockers", function (res) {
		res.forEach(function (item, i) {
			$("<option>").text(item.hostname).val(i).appendTo("#dockers")
		})

		$("#dockers").trigger("change");

	})

	$("#dockers").change(function () {
		$("#apps").empty();
		$.getJSON(`/dockers/${$(this).val()}`, function (res) {
			res.forEach(function (app) {
				app.Ports.forEach(function (port) {
					if (port.PublicPort) {
						$("<option>").text(port.PublicPort).val(+port.PublicPort).appendTo("#apps")
					}
				})
			});
		})
	})
	$("#set_target").click(function () {
		var params = {
			docker: $("#dockers").val(),
			port: $("#apps").val()
		}
		$.ajax({
			url: "/target",
			data: params,
			method: "PUT",
			success: function () {
				$("#target").load("/target")
			}
		})
	})
})