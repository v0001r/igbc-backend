for (let i = 1; i <= 10; i++) {
  $(".type_of_conditioner" + i).on("change", function () {
    let type = $(".type_of_conditioner" + i).val();

    if (
      type == "split_ac" ||
      type == "cassette_unit" ||
      type == "packaged_air_conditioning"
    ) {
        $(".type_of_system" + i).removeAttr('readonly');
    } else {
        $(".type_of_system" + i).attr('readonly', true);
    }
  });
}

  // $(document).ready(function() {
  //       const i = 1;

  //       function calculate(i) {
  //           let qty = parseFloat($(`.quantity${i}`).val()) || 0;
  //           let cap = parseFloat($(`.actual_capacity${i}`).val()) || 0;
  //           $(`.total_cooling${i}`).val((qty * cap).toFixed(2));
  //       }

  //       $(`.quantity${i}, .actual_capacity${i}`).on('input', function() {
  //           calculate(i);
  //       });
  //   });

  $(document).ready(function () {
  $('.quantity, .actual_capacity').on('input', function () {
    const $row = $(this).closest('tr'); // or use .parent() if in a div
    const qty = parseFloat($row.find('.quantity').val()) || 0;
    const cap = parseFloat($row.find('.actual_capacity').val()) || 0;
    $row.find('.total_cooling').val((qty * cap).toFixed(2));
  });
  // calculate_non_ac();
});



$(document).ready(function () {
  $('.efficiency_unit, .total_cooling, .efficiency_value, .days_of_operation, .operation').on('input change', function () {
    const $row = $(this).closest('tr'); // Find the parent row

    const method = $row.find('.efficiency_unit').val();

    if (method === 'iseer' || method === 'cop' || method === 'eer') {
      const cooling = parseFloat($row.find('.total_cooling').val()) || 0;
      const efficiency = parseFloat($row.find('.efficiency_value').val()) || 1;
      const days = parseFloat($row.find('.days_of_operation').val()) || 0;
      const hours = parseFloat($row.find('.operation').val()) || 0;

      const result = (cooling / efficiency) * days * hours;
      $row.find('.annual_energy').val(result.toFixed(2));
    } else {
      $row.find('.annual_energy').val('');
    }
  });
  // calculate_non_ac();
});




